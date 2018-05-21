

export type OrgRef = string 
                   | Organization


export interface Organization {

}

export type Location = AnyLoc
                     | USLocation

export interface Opportunity {
    title        :string
    org          :Organization
    description? :string
    location?    :Location
}

export interface EventOpportunity
            extends Opportunity {
    date  :string
    time? :string
}

export interface AnyLoc {
    address? :string
    city?    :string
    country  :string
}

export interface USLocation 
        extends AnyLoc {
    state :string
    zip?  :string
}