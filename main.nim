import json, strutils, sequtils, sugar, re, mummy, mummy/routers
from httpclient import newHttpClient, getContent, close

const
  COURSES = ["ID", "Name", "Description", "Subject", "Grad Studies Eligible", "Credit Hours", "Term Available", "Prerequisites", "Corequisites"]
  DELIMITER = "\t"
  HTML = slurp("index.html")
let
  client = newHttpClient()
  catalog = parseJson(client.getContent("https://www.rose-hulman.edu/academics/course-catalog/current/index.json"))
  csvFile = open("courses.csv", fmReadWrite)
  linkHead = re"<a.*\"">"
  betweenOr = re"</a>\s*or\s*<a.*\"">"
  betweenAnd = re"</a>[,\s]*and[either\s]*<a.*\"">"
  extraSpace = re"\s+"
csvFile.write(COURSES.join(DELIMITER))
for course in catalog["courses"]:
  var 
    index = 0
    page = client.getContent("https://www.rose-hulman.edu/academics/course-catalog/current/" & course["link"].getStr().replace(" ", "%20"))
    content : string
  csvFile.write('\n' & ["num", "name", "description", "subject", "gradStudiesEligible"].map(section => course[section].getStr().strip()).join(DELIMITER))
  for section in COURSES[5..8]:
    index = page.find(section, index)
    content = page[index+len(section)+1..page.find("</li>", index+12)-1]
    if section in COURSES[7..8]:
      content = content.multiReplace([(linkHead, " "), (betweenOr, "/"), (betweenAnd, " + ")]).replace("</a>", " ").replace(extraSpace, " ")
    csvFile.write(DELIMITER & content.strip())
client.close()
csvFile.close()

proc indexHandler(request: Request) =
  var headers: HttpHeaders
  headers["Content-Type"] = "text/html"
  request.respond(200, headers, HTML)

var router: Router
router.get("/", indexHandler)

let server = newServer(router)
echo "Serving on http://localhost:8080"
server.serve(Port(8080))