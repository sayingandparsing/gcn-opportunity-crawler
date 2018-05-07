
import $ from 'cheerio'
import rp from 'request-promise'
//import {Maybe, Just} from 'sanctuary'



/**
 * Exposes methods used to fetch content from web services
 */
export class RequestChannel {

    baseUrl :String
    
    constructor(baseUrl :String) {
        this.baseUrl = baseUrl
    }

    /**
     * 
     * @param uri 
     * @param callback 
     * @param options 
     * @param onFail 
     */
    async fetchPage(uri      :String, 
                    callback :Callable<String,Any>,
                    options? :Object,
                    onFail?)
                    :Promise<String|null> {

        return await rp({
            uri: this.specify(uri),
            ...options
        })
            .then(res => callback(res))
            .catch(err =>
                onFail 
                    ? onFail(err) 
                    : this.logFailure(err))
    }
  

    const specify = (uri :String) :String =>
        this.baseUrl + '/' + uri


    logFailure(err) {

    }

    /**
     * Namespace for private utility functions
     */
    util = class {
        a = () => "hello"

    }
}