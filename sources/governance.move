
module governance::governance {
    use blob_store::blob::Blob;
    use sui::clock::{Clock};
    use std::string::{String, utf8};

    public struct Proposal has key {
        id: UID,
        name: String,
        blob: Blob,
        accepted: bool,
        last_voting_time: u64
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

