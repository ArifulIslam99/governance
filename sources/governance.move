
module governance::governance {
    use blob_store::blob::Blob;
    use sui::clock::{Clock};
    use std::string::{String, utf8};
    use sui::table::{Self, Table};

    public struct Proposal has key, store {
        id: UID,
        name: String,
        blob: Blob,
        accepted: bool,
        last_voting_time: u64
    }

    public struct ProposalList has key, store {
        id: UID,
        list: Table<ID, Proposal>
    }

    public struct Users has key, store {
        id: UID,
        list: Table<address, bool>
    }


    public entry fun create_proposal() {


    }

    public entry fun vote() {

    }

    public entry fun approve_proposal() {

    }

    public entry fun add_user_dao() {

    }

    public entry fun remove_user_dao() {
        
    }


}

