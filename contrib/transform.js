const fs = require("fs")
const path = require('path');
const wget = require('wgetjs');
const url = require('url');

const docBaseUrl = process.argv[2]

const baseFolder = "./content"

Array.prototype.flatMap = function(lambda) {
  return Array.prototype.concat.apply([], this.map(lambda));
};

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function sortProperties(obj)
{
  // convert object into array
  var sortable=[];
  for(var key in obj)
    if(obj.hasOwnProperty(key))
      sortable.push([key, obj[key]]); // each item is an array in format [key, value]

  // sort items by value
  sortable.sort(function(a, b)
  {
    var x=a[0].toLowerCase(),
      y=b[0].toLowerCase();
    return x<y ? -1 : x>y ? 1 : 0;
  });
  return sortable; // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
}


function mergeCol(accumulator, item) {
  for(var key in item)
    if(item.hasOwnProperty(key)) {
      if(! accumulator.hasOwnProperty(key)) {
        accumulator[key] = item[key]
      }
      else {
        accumulator[key] = [accumulator[key], item[key]].flatMap( x => x)
      }
    }
  return accumulator
}

function processImage(image, baseFile) {
  let imageUrl = url.parse(image);
  const fileName = path.basename(imageUrl.pathname)
  const destinatonDir = ['./static', 'images/'].join("/")
  wget({uri: image, dest: destinatonDir});
  return ['/images', fileName].join("/")
}


const folders = fs.readdirSync(baseFolder)
                    .flatMap(dir => fs.readdirSync([baseFolder, dir].join("/"))
                                    .flatMap(leaf => [dir, [dir, leaf].join("/")])
                    ).filter(file => ! file.includes(".md")).filter(onlyUnique)

console.log(folders)
const ticks = "```"
const emoTab = {
	warning: ":warning:",
	info: ":information_source:",
	danger: ":no_entry_sign:"
}
const toc = {}
let newDoc = ""

// Function to parse text from a file and return all blocks (samples of code or callouts)
const parseBlocks = (text) => {
	const regex = /\[block:([\w\-]*)\]\n([\s\S]*?)\n\[\/block]/gm;
	const data = []
	let m
	let i = 0
	while ((m = regex.exec(text)) !== null) {
		if (m.index === regex.lastIndex) {
			regex.lastIndex++;
		}
		m.forEach((match, groupIndex) => {
			if (groupIndex === 0) {
				data[i] = {}
				data[i].full = match
			}
			if (groupIndex === 1) {
				data[i].type = match
			}
			if (groupIndex === 2) {
				data[i].code = JSON.parse(match)
				i++
			}
		})
	}
	return data
}

// Function to replace the anchor from readme.io to direct links to the readme.io documentation (or any other url in argument)
const changeAnchors = (text) => {
	const regex = /\[.*?\]\((#.*?)\)/g
	let m
	const links = []
	let i = 0

	while((m = regex.exec(text)) !== null) {
		if (m.index === regex.lastIndex) {
			regex.lastIndex++
		}
		m.forEach((match, groupIndex) => {
			if (groupIndex === 1) {
				links.push(match)
			}
		})
	}
	for (const link of links) {
		console.log(link)
		text = text.replace(`(${link})`, `(${docBaseUrl}${link})`)
	}
	return text
}

// Simple function just to format the anchor from a title
const createLink = (title) => {
	return title.replace("(", "").replace(")", "").replace("]", "").replace(/\s\[\,\s/g, "--").replace(/\,\s/g, "-").replace("[", "").toLowerCase().replace(" ", "")
}

for (const folder of folders) {
	const textObject = []
	let files = fs.readdirSync(`${baseFolder}/${folder}`).filter(file => file.includes(".md"))
	const sectionName = folder.charAt(0).toUpperCase() + folder.slice(1)
	newDoc += `\n# ${sectionName}\n\n`
	toc[sectionName] = []
	for (const file of files) {
	  const debug =  file.includes("terraform-datadog-aws-integration")
		console.log(`Changing file ${folder}/${file}...`)
		const func = {}
		let text = fs.readFileSync(`${baseFolder}/${folder}/${file}`).toString()
		text = changeAnchors(text)
		const blocks = parseBlocks(text)
		for (const block of blocks) {
			if (block.type === "callout") {
				const example = block.code
				const mdExample = `\n##### ${emoTab[example.type]} ${example.title}\n> ${example.body.replace(/(?:\r\n|\r|\n)/g, '\n >')}\n`
				text = text.replace(block.full, mdExample)
			}
      if (block.type === "image") {
			  const newVal = block.code.images.map(function(image){
			    if (image.image[0] !== undefined) {
            const caption = image.caption ? image.caption : ''
            console.log(image)
            const url = processImage(image.image[0], [baseFolder, folder, file].join("/"))
            return `![${caption}](${url})${caption}`
          }
          return ''
        })
        text = text.replace(block.full, newVal)
      }
      if (block.type === "html") {
        text = text.replace(block.full, "")
      }
      if (block.type === "api-header") {
			  const newVal = "# " + block.code.title + "\n"
        text = text.replace(block.full, newVal)
      }
      if (block.type === "parameters") {
          const table = sortProperties(block.code.data).map(function(item){
            const row = item[0].split("-")[0] == "h" ? 0 : 1 + parseInt(item[0].split("-")[0]);
            const col = item[0].split("-")[1];
            const value = item[1];
            const rows = {}
            const cols = {}
            cols[col] = value
            rows[row] = cols
            return rows
          }).reduce(function(acc, item) {
            for(var key in item)
              if(item.hasOwnProperty(key)) {
                if(! acc.hasOwnProperty(key)) {
                  acc[key] = Object({})
                }
                acc[key] = mergeCol(acc[key], item[key])
              }
            return acc
            }, Object({})
          )

          for(var key in table)
            if(table.hasOwnProperty(key)) {
              table[key] = sortProperties(table[key]).map( x => x[1].replace("\n", ""))
            }

          if (!table.hasOwnProperty(0)) {
            table[0] = table[1].map( x => '')
          }

          for(var key in table)
            if(table.hasOwnProperty(key)) {
              table[key] =
                "|" + table[key].join("|") + "|" +
                (key == '0' ?  "\n|" + table[key].map( x => '------').join("|") + "|" : '')
            }

          const newVal = "\n" + sortProperties(table).map( x => x[1]).join("\n") + "\n"
          text = text.replace(block.full, newVal)
      }
			if (block.type === "code") {
				const mdExample = block.code.codes.map(item =>
          `\n##### ${item.name ? item.name : ""}\n${ticks}${item.language}\n${item.code}\n${ticks}\n`
        ).join("\n")
				text = text.replace(block.full, mdExample)
			}
		}
		text = text.replace(/\#\# \—/g, "### —")
    fs.writeFileSync([baseFolder, folder, file].join("/"), text)
	}
}
console.log("Transform finished.")
console.log("Please wait downloading images....")
