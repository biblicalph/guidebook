# Contribution guide

## Developing Guidebook

You consider contributing changes to Guidebook – thank you!
Please consider these guidelines when contributing changes.

* All changes should be covered by test cases
* 2 spaces indentation is used in this project. The project also follows the [Airbnb style guide](https://github.com/airbnb/javascript)
* Pull request branch names should be in the form `{task-type}/description-of-branch`. Example `ch/setup-project-tools`. See section [task types](#task-types)
* Commits follow the [Angular commit convention](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines)
* To commit code, run `npm run commit` and follow the instructions. Write great commit messages. See [how to write commit messages](https://chris.beams.io/posts/git-commit/) guide
* (Optional) Consider signing Git commit messages. See [git tools signing your work](https://git-scm.com/book/en/v2/Git-Tools-Signing-Your-Work) and [signing commits](https://help.github.com/articles/signing-commits/)
* Squash all commits in a PR to exactly one commit

### Task Types
* `ft` (Feature): An issue that adds a new feature
* `bg` (Bug): An issue that represents a bug
* `ch` (Chore): An issue that represents a refactor or changes that are neither feature nor bug