import { Opportunity } from "../../../types/ExtractedData";
import { RequestChannel } from "../../../site-interaction/RequestChannel";
import cherrio from "cheerio"


export class RedCrossScraper {

    searchPage = 'http://www.redcross.org/volunteer/become-a-volunteer#step1'

    requesting = new RequestChannel()

    results :Opportunity[] = new Array()

    /**
     * RC allows searching by zip, but returns all results
     * for the entire region containing that zip. To ensure
     * minimally-redundant capture of all results, we check 
     * against a list of regions already visited.
     */
    regionsProcessed :string[] = new Array()

    delay = 0.5

    constructor() {

    }
    
    formatRequest = (zip: number, category: number): string =>
        ''.format
    
    getOpportunitiesForZip(zip: number) :string[] {
        return new Array()
    }

    iterateQueries(zipList :number[],
                   categories: number[]) {
        zipList.forEach(zip => {
            categories.forEach(cat => {
                const query = this.formatRequest(zip, cat)
                this.requesting.fetchPage(
                    query,
                    this.extractContent
                )
            })
        })
    }

    extractContent(page :string) {
        // isolate text content
        const $ = cheerio.load(page)
        const openings = $('#rco-openings')
        openings.each((i, elem) => {
            const region = $('')
        });
    }

    async mapToSelection(selector :string,
                         element :Cheerio,
                         operation :(Cherrio) => Any,
                         $) {
        $(selector).each((i, elem) => operation(elem))
    }

    noOpportunities() :Boolean {}


}

