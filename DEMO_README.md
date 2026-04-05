Demo: Skills Catalogue + CI
==========================

Overview
--------
This demo shows how to generate a human-friendly report from `.github/skills-index.json` and run it in CI.

What I added
- `scripts/generate_skills_report.py` — reads the skills index and writes `reports/skills_report.md`.
- `.gitlab/demo-skills.yml` — demo GitLab CI job that runs the script and saves the report as an artifact.
- `.gitlab-ci.yml` was updated to include the demo file (no changes to the existing pipeline logic).

Run locally
-----------
Requirements: Python 3.8+

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
python3 scripts/generate_skills_report.py
# result at reports/skills_report.md
```

CI
--
Push a branch to your GitLab remote and the pipeline will include the demo job (it writes `reports/skills_report.md` as an artifact).

Next steps
----------
- If you want this job to run in a specific stage or trigger on merge requests, we can adjust `.gitlab/demo-skills.yml`.
- I can create a demo branch, add these files, and push to GitLab once you provide the GitLab project URL or `GITLAB_TOKEN` to create a project.
