import { 
    Opportunity, 
    EventOpportunity,
    Location
        } from "../../types/ExtractedData";
import { RequestChannel } from "../../site-interaction/RequestChannel";
import * as cheerio from "cheerio"
import * as fs from "fs"



/*export interface HabitatResult 
            extends EventOpportunity {

}*/

export class HabitatResult implements EventOpportunity {
    org :string = "Habitat For Humanity Austin"
    title :string
    description :string = ""
    longDescription :string = ""
    location :Location = null
    date :string = ""
    time :string = ""

    results :HabitatResult[] = new Array

    constructor(title) {
        this.title = title     
    }
}

export class HabitatScraper {

    searchPage = 'https://austinhabitat.volunteerhub.com'
    requesting = new RequestChannel()
    results :HabitatResult[] = new Array()
    delay = 0.5

    constructor() {

    }

    async process(url) {
        await this.requesting.fetchPage(url, ()=>{})
            .then(res => this.extractListings(res))
            .catch(err => console.log(err))
    }
    

    extractListings(content) {
        
        let $ = cheerio.load(content)
        const dayBlocks = $('div .events-listing')

        dayBlocks.each((i, elem) => {
            $(elem).find('.row.mx-sm-0').each((i, listing) => {
                const res = this.processListing(listing, $)
                console.log(this.results.length)
                this.results.push(res)
            })
        })
    }

    processListing(listing :CheerioElement, 
                   $ :CheerioStatic) :HabitatResult {
        const title = $(listing).find('a').first().text().trim()
        const [date, time] = this.getDateTime(listing, $)
        const address = $(listing).find('.fa-map-marker')
                                  .next().first().text().trim()
        const description = this.getDescription(listing, $)
        const res = new HabitatResult(title)
        res.date = date
        res.time = time
        res.location = {address: address, city: "Austin", country: "US"}
        res.description = description
        return res

    }

    getDateTime(listing :CheerioElement,
                $ :CheerioStatic) {
        const dateTime = $(listing).find('.fa-clock-o').next().first().text().trim()
        const date = dateTime.split(',')
                             .map(x=>x.trim())
                             .splice(0, 2)
                             .join(', ')
        const time = dateTime.split(',')
                             .map(x=>x.trim())[2]
        return [date, time]
    }

    getDescription(listing :CheerioElement,
                   $ :CheerioStatic) :string {
        const desc = $(listing).find('div .tinyMceContent').find('p').first().text().trim()
        return desc
    }



    /**
     * Functions for generating CSV output
     * 
     * The anonymous class below functions like a namespace,
     * and is used purely for organizational purposes
     */
    CSV = class {

        header() {
            return '"' + [
                "Title",
                "Date",
                "Time",
                "Location",
                "Description"
            ].join('", "') + '"'
        } 

        toCsv(results :HabitatResult[], path :string) {
            type Row = string
            const rows :Row[] = results.map(res => 
                this.arrayToRow(
                    this.resToArray(res)
                )
            )
            const rowsWithHead = [this.header(), ...rows]
            const content = rowsWithHead.join("\n")
            this.writeToFile(content, path)
        }

        writeToFile(content :string, path :string) {
            fs.writeFile(path, content, (err) => console.log(err))
        }


        resToArray(res :HabitatResult) :string[] {
            return [
                res.title,
                res.date,
                res.time,
                //...this.locationToArray(res.location),
                res.location.address,
                res.description
            ].map(item => {
                return item ? item
                            : ""
            })
        }

        locationToArray(loc :Location) :string[] {
            return [
                loc.address,
                loc.city
            ].map(item => {
                return item ? item
                            : ""
            })
        }

        arrayToRow(elems :string[]) :string {
            return '"' + elems.join('", "') + '"'
        }


    }
    
}
console.log('starting')

async function run() {
    const h = new HabitatScraper()
    await h.process(h.searchPage)
    console.log(h.results.length)
    h.CSV.prototype.toCsv(h.results, '/home/reagan/Downloads/habitat_austin_may18.csv')
}
run()