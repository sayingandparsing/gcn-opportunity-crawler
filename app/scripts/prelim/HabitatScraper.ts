import { 
    Opportunity, 
    EventOpportunity,
    Location
        } from "../../types/ExtractedData";
import { RequestChannel } from "../../site-interaction/RequestChannel";
import * as cheerio from "cheerio"



/*export interface HabitatResult 
            extends EventOpportunity {

}*/

export class HabitatResult implements EventOpportunity {
    org :String = "Habitat For Humanity Austin"
    title :String
    description :String = ""
    location :Location = null
    date :String = ""
    time :String = ""

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
                this.results.push(res)
            })
        })
        this.CSV.prototype.toCsv(this.results, "")
    }

    processListing(listing :CheerioElement, 
                   $ :CheerioStatic) :HabitatResult {
        const title = $(listing).find('a').first().text().trim()
        const [date, time] = this.getDateTime(listing, $)
        const address = $(listing).find('.fa-map-marker')
                                  .next().first().text().trim()
        const description = "test"
        const res = new HabitatResult(title)
        res.date = date
        res.time = time
        res.location = {address: address, city: "Austin", country: "US"}
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
        console.log(time)
        return [date, time]
    }



    /**
     * Functions for generating CSV output
     * 
     * The anonymous class below functions like a namespace,
     * and is used purely for organizational purposes
     */
    CSV = class {

        header = [
            "Title",
            "Date",
            "Time",
            "Location",
            "Description"
        ]

        toCsv(results :HabitatResult[], path :String) {
            type Row = String
            const rows :Row[] = results.map(res => 
                this.arrayToRow(
                    this.resToArray(res)
                )
            )
            const rowsWithHead = [this.header, ...rows]
            const content = rowsWithHead.join("\n")
            console.log(content)
            //this.writeToFile(content, path)
        }

        writeToFile(content :String, path :String) {

        }


        resToArray(res :HabitatResult) :String[] {
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

        locationToArray(loc :Location) :String[] {
            return [
                loc.address,
                loc.city
            ].map(item => {
                return item ? item
                            : ""
            })
        }

        arrayToRow(elems :String[]) :String {
            return '"' + elems.join('", "') + '"'
        }


    }
    
}
console.log('starting')

const h = new HabitatScraper()
h.process(h.searchPage)

