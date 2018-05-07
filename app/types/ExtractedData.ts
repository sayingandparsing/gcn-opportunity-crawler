

export type OrgRef = String 
                   | Organization


export interface Organization {

}

export interface Opportunity {
    title        :String
    org          :Organization
    description? :String
    location?    :Location
}

export interface Location {
    address? :String
    city?    :String
}

export interface USLocation 
        extends Location {
    state :String
    zip?  :String
}