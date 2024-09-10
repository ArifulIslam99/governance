
module governance::governance {
    use blob_store::blob::Blob;
    use sui::clock::{Clock};
    use std::string::{String, utf8};
    use sui::table::{Self, Table};


    const ENOTDAOMEMBER: u64 = 10;

    public struct Proposal has key, store {
        id: UID,
        name: String,
        blob: Blob,
        accepted: bool,
        min_threshold: u64,
        weight: u64,
        last_voting_time: u64
    }

    public struct ProposalList has key, store {
        id: UID,
        list: Table<ID, Proposal>
    }

    public struct Users has key, store {
        id: UID,
        list: Table<address, u64>
    }


    public entry fun create_proposal(name: String, blob: Blob, proposal_list: &mut ProposalList, min_threshold: u64, users: &Users, ctx: &mut TxContext) {
        let sender = tx_context::sender(ctx);
        assert!(table::contains(&users.list, sender), ENOTDAOMEMBER);
        let new_proposal = Proposal {
            id: object::new(ctx),
            name,
            blob,
            accepted: false,
            min_threshold,
            weight: 0,
            last_voting_time: 0
        };
        table::add(&mut proposal_list.list, *object::uid_as_inner(&new_proposal.id), new_proposal);
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

