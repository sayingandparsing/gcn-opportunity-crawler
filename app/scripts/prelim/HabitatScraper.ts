import { 
    Opportunity, 
    EventOpportunity,
    Location,
    OrgRef
        } from "../../types/ExtractedData";
import { RequestChannel } from "../../site-interaction/RequestChannel";
import * as cheerio from "cheerio"
import * as fs from "fs"



/*export interface HabitatResult 
            extends EventOpportunity {

}*/

export interface HabitatResult 
            extends EventOpportunity {
    org             :string
    title           :string
    description     :string
    longDescription :string
    location        :Location
    date            :string
    time            :string
    link            :string
}



export class HabitatScraper {

    searchPage = 'https://austinhabitat.volunteerhub.com'
    org = 'Habitat for Humanity Austin'
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
                console.log(res)
                this.results.push(res)
            })
        })
    }

    processListing(listing :CheerioElement, 
                   $ :CheerioStatic
                  ) :HabitatResult {
        const [date, time] = this.getDateTime(listing, $)     
        const titleElem = $(listing).find('a').first()
        const address = $(listing).find('.fa-map-marker')
                                  .next().first().text().trim()
        console.log(address)
        return {
            link: this.searchPage + titleElem.attr('href'),
            title: titleElem.text().trim(),
            description: this.getDescription(listing, $),
            longDescription: '',
            date: date,
            time: time,
            location: {address: address, city: "Austin", country: "US"},
            org: this.org
        }
    }

    getDateTime(listing :CheerioElement,
                $ :CheerioStatic) {
        const dateTime = $(listing).find('.fa-clock-o').next().first().text().trim()
        const date = dateTime.split('\n\t\t\t')
                             .map(x=>x.trim())
                             .splice(0, 1)
                             .join(', ')
        const time = dateTime.split('\n\t\t\t')
                             .map(x=>x.trim()).splice(1)
                             .join(' ')
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
    console.log(h.results)
    fs.writeFile('/home/reagan/Downloads/habitat_austin_may18.csv',
                JSON.stringify(h.results),
                (err) => console.log(err))
}
run()