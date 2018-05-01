---
title: "Language Libraries & Frameworks"
excerpt: ""
---
`Library` - is the software that can be run only as a part of some other software. Developers extract reusable code as a library and store it in artifact storage allow to include it in multiple projects.

Examples are npm packages, ruby gems, python modules, etc. Ultimately, these libraries are typically bundled as part of the Docker image along with other software. 

It does not have **deploy** step because they are included as dependencies by other software. 
Because of that it also does not have the **operate** and **monitoring** steps
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/0effe9c-Process_Loop_-_Library_-_Page_1.png",
        "Process Loop - Library - Page 1.png",
        1826,
        1424,
        "#978771"
      ],
      "caption": "Library Process Loop"
    }
  ]
}
[/block]