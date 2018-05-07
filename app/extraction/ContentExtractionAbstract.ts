import {
    $
} from 'cheerio'
import {
    Opportunity
} from '../types/ExtractedData'

export class ContentExtraction<L> {
    
    isolatePostings(pageContent, selectFn) :Array<Any> {
        
    }

    extractInformation(post, extractFn) :L {
        return extractFn(post)
    }
}