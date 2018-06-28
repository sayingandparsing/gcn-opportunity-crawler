

export type OrgRef = string 
                   | Organization


export interface Organization {
    name :string
    branch? :string
    affiliations? :string[]
}

export type Location = AnyLoc
                     | USLocation

export interface Opportunity {
    title        :string
    org          :OrgRef
    description? :string
    location?    :Location
}

export interface EventOpportunity
            extends Opportunity {
    date  :string
    dateEnd? :string
    time? :string
    timeEnd? :string
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