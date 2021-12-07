---
title: "GitHub find which PR deleted a file"
description: "How can you find which GitHub PR deleted a file in your repository? Using a git command and a special GitHub link you can find when the file was deleted."
date: "2021-12-07"
image: "/img/find-deleted-files-github-pr-banner.png"
topPost: false
tags: ["Git"]
---

Today at work I noticed a file had been deleted in our repository. I wasn't sure who deleted it or why it was deleted. I really wanted to figure out which GitHub PR removed the file so I could get some context!

## An example

To test this out, without revealing any of my work code, I created a new file named `foo` in [this repo](https://github.com/jkup/jonkuperman.com). Then I made a PR deleting that file and merged it into main.

## Step 1: Find the commit that deleted the file

This took a bit of searching, but I was able to find [on Stack Overflow](https://stackoverflow.com/questions/6839398/find-when-a-file-was-deleted-in-git) a git command that will show you the full history of a file, even if it has been deleted.

```bash
git log --full-history  -- [file path]
```

So, for my `foo` file, I typed in:

```bash
git log --full-history  -- foo
```

And got back:

```bash
commit 63ca48a2cc63196df5428ddb0c09cda3002a8da3 (HEAD -> master, origin/master, origin/HEAD)
Merge: b7f2ad2 c48771f
Author: Jon Kuperman <jon.kuperman@nicetry.com>
Date:   Tue Dec 7 13:38:00 2021 -0500

    Merge pull request #14 from jkup/sample-pr

    Delete foo (you found me)

commit c48771fd5dadf28d456be9202079dd95a0cff47a (origin/sample-pr, sample-pr)
Author: Jon Kuperman <jon.kuperman@nicetry.com>
Date:   Tue Dec 7 13:37:39 2021 -0500

    Delete foo (you found me)

commit b7f2ad23d2d19fb7d589f993a87946141fb9cbae
Author: Jon Kuperman <jon.kuperman@nicetry.com>
Date:   Tue Dec 7 13:37:22 2021 -0500

    add foo
```

## Step 2: Grab the git SHA

Now I can see the entire history of the file. I want to see when it was deleted and that means I want to see the very last commit that touched it. Therefore, I'll copy the SHA at the top of the output, `63ca48a2cc63196df5428ddb0c09cda3002a8da3`.

## Step 3: A cool GitHub URL

The final step is figuring out what PR contained the offending commit. For that we can use this neat GitHub URL:

`github.com/username/project/commit/SHA`

For our example we have:

- username: jkup
- projects: jonkuperman.com
- sha: 63ca48a2cc63196df5428ddb0c09cda3002a8da3

So our final URL is:

https://github.com/jkup/jonkuperman.com/commit/63ca48a2cc63196df5428ddb0c09cda3002a8da3

## Step 4: Click the PR

The last bit is just clicking through the GitHub UI to go from commit to PR. If you look at the top of the link above, you'll see the PR in parenthesis. In this case it's #14. Click on that and it will take you to the offending PR!

![GitHub find PR for deleted file](/img/github-find-deleted-file.png)

And there it is, the PR that deleted `foo` from my repo: https://github.com/jkup/jonkuperman.com/pull/14
