import os
import sys
import pytest
from unittest import mock
import argparse

from autogenerateagentsmd.cli import (
    parse_arguments,
    resolve_repository_target,
    run_agents_md_pipeline,
    setup_language_model,
)

def test_parse_arguments_defaults():
    """Test default arguments when no flags are passed."""
    with mock.patch.object(sys, 'argv', ['autogenerateagentsmd', '/tmp/repo']):
        args = parse_arguments()
        assert args.local_repo_pos == '/tmp/repo'
        assert args.github_repository is None
        assert args.style == 'comprehensive'
        assert args.analyze_git_history is None
        assert args.model is None
        assert args.api_base is None
        assert args.api_key is None

def test_parse_arguments_flags():
    """Test CLI flag parsing."""
    test_args = [
        'autogenerateagentsmd',
        '--github-repository', 'https://github.com/foo/bar',
        '--style', 'strict',
        '--analyze-git-history',
        '--model', 'openai',
        '--api-base', 'http://localhost:11434',
        '--api-key', 'secret-key'
    ]
    with mock.patch.object(sys, 'argv', test_args):
        args = parse_arguments()
        assert args.github_repository == 'https://github.com/foo/bar'
        assert args.style == 'strict'
        assert args.analyze_git_history == 500
        assert args.model == 'openai'
        assert args.api_base == 'http://localhost:11434'
        assert args.api_key == 'secret-key'

def test_resolve_repository_target_github():
    """Test resolving a github repository from args."""
    args = argparse.Namespace(
        github_repository="https://github.com/foo/bar.git",
        local_repository=None,
        local_repo_pos=None
    )
    url, local, name = resolve_repository_target(args)
    assert url == "https://github.com/foo/bar.git"
    assert local is None
    assert name == "bar"

def test_resolve_repository_target_local_pos():
    """Test resolving a local repository from positional args."""
    # We mock os.path.exists to avoid needing a real directory
    with mock.patch('os.path.exists', return_value=True):
        args = argparse.Namespace(
            github_repository=None,
            local_repository=None,
            local_repo_pos="/absolute/path/to/myrepo"
        )
        url, local, name = resolve_repository_target(args)
        assert url is None
        assert local == "/absolute/path/to/myrepo"
        assert name == "myrepo"

def test_resolve_repository_target_local_missing():
    """Test standard FileNotFoundError when local path doesn't exist."""
    args = argparse.Namespace(
        github_repository=None,
        local_repository="/fake/path",
        local_repo_pos=None
    )
    with pytest.raises(FileNotFoundError, match="Local repository path does not exist"):
        resolve_repository_target(args)

@mock.patch('builtins.input', return_value="/input/path")
def test_resolve_repository_target_interactive_fallback(mock_input):
    """Test interactive fallback when no args or env vars are provided."""
    with mock.patch.dict(os.environ, clear=True), mock.patch('os.path.exists', return_value=True):
        args = argparse.Namespace(
            github_repository=None,
            local_repository=None,
            local_repo_pos=None
        )
        url, local, name = resolve_repository_target(args)
        assert url is None
        assert local == "/input/path"
        assert name == "path"


def test_run_agents_md_pipeline_no_revert_commits_continues():
    """When --analyze-git-history finds no reverted commits, the pipeline
    should continue without git insights rather than exiting early."""
    mock_lm = mock.MagicMock()

    mock_conventions_result = mock.MagicMock()
    mock_conventions_result.markdown_document = "# Conventions\n"

    mock_agents_result = mock.MagicMock()
    mock_agents_result.agents_md_content = "# AGENTS\n"

    with (
        mock.patch('autogenerateagentsmd.cli.load_source_tree', return_value={"file.py": "content"}),
        mock.patch('autogenerateagentsmd.cli.extract_reverted_commits', return_value=[]) as mock_git,
        mock.patch('autogenerateagentsmd.cli.CodebaseConventionExtractor') as mock_extractor_cls,
        mock.patch('autogenerateagentsmd.cli.AgentsMdCreator') as mock_creator_cls,
        mock.patch('autogenerateagentsmd.cli.save_agents_to_disk') as mock_save,
    ):
        mock_extractor_cls.return_value.return_value = mock_conventions_result
        mock_creator_cls.return_value.return_value = mock_agents_result

        # Should complete without raising SystemExit
        run_agents_md_pipeline(
            repo_dir="/tmp/repo",
            repo_name="myrepo",
            lm=mock_lm,
            style="comprehensive",
            analyze_git_history=500,
        )

    # extract_reverted_commits was called with the right args
    mock_git.assert_called_once_with("/tmp/repo", limit=500)
    # Pipeline continued: extractor and creator were invoked
    mock_extractor_cls.return_value.assert_called_once()
    mock_creator_cls.return_value.assert_called_once()
    # Output was saved
    mock_save.assert_called_once_with("myrepo", "# AGENTS\n")
