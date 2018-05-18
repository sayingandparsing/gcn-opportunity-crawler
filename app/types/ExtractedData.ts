

export type OrgRef = String 
                   | Organization


export interface Organization {

}

export type Location = AnyLoc
                     | USLocation

export interface Opportunity {
    title        :String
    org          :Organization
    description? :String
    location?    :Location
}

export interface EventOpportunity
            extends Opportunity {
    date  :String
    time? :String
}

export interface AnyLoc {
    address? :String
    city?    :String
    country  :String
}

export interface USLocation 
        extends AnyLoc {
    state :String
    zip?  :String
}