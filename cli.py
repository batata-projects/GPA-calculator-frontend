import argparse
import subprocess

FILES_TO_CLEAN = ["backend"]


def clean():
    subprocess.run(
        [
            "autoflake",
            "--remove-all-unused-imports",
            "--remove-unused-variables",
            "--recursive",
            *FILES_TO_CLEAN,
            "-i",
            "--exclude=__init__.py",
        ]
    )
    subprocess.run(["isort", *FILES_TO_CLEAN, "--profile", "black"])
    subprocess.run(["black", *FILES_TO_CLEAN])
    subprocess.run(["mypy", *FILES_TO_CLEAN])


def run_backend():
    subprocess.run(["uvicorn", "backend.src.main:app", "--reload"])


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("command", type=str, help="Command to run")
    args = parser.parse_args()
    if args.command == "clean":
        clean()
    elif args.command == "run-backend":
        run_backend()
    else:
        print("Invalid command")


if __name__ == "__main__":
    main()
