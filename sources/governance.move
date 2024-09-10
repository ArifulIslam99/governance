
module governance::governance {
    use blob_store::blob::Blob;
    use sui::clock::{Self, Clock};
    use std::string::{String};
    use sui::table::{Self, Table};

    const OGMEMBERS: vector<address> = vector[
        @0x8f6ff638438081e30f3c823e83778118947e617f9d8ab08eca8613d724d77335,
        @0xd1deff6ee20b10987bfe8d50f70f893e0465f0d00bcb638c19ad979d83f1c9c0,
        @0x5fbe2d6fb9863859ab0fa867926557e6d0859e36cdad448c2f8ef69bf2c7ef6d
    ];

    const ENOTDAOMEMBER: u64 = 10;
    const ENOTVALIDPROPOSAL: u64 = 11;
    const EINVALIDACCESS: u64 = 12;
    const ENOTENOUGHVOTE: u64 = 13;
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
        list: Table<address, Proposal>
    }

    public struct Users has key, store {
        id: UID,
        list: Table<address, u64>
    }


    public entry fun create_proposal(name: String, blob: Blob, proposal_list: &mut ProposalList, min_threshold: u64, users: &Users, ctx: &mut TxContext) {
        assert!(table::contains(&users.list, tx_context::sender(ctx)), ENOTDAOMEMBER);
        let new_proposal = Proposal {
            id: object::new(ctx),
            name,
            blob,
            accepted: false,
            min_threshold,
            weight: 0,
            last_voting_time: 0
        };
        table::add(&mut proposal_list.list, object::uid_to_address(&new_proposal.id), new_proposal);
    }

    public entry fun vote(proposal_list: &mut ProposalList, proposal: address, users: &Users, clock: &Clock, ctx: &mut TxContext) {
        assert!(table::contains(&users.list, tx_context::sender(ctx)), ENOTDAOMEMBER);
        assert!(table::contains(&proposal_list.list, proposal), ENOTVALIDPROPOSAL);
        let proposal = table::borrow_mut(&mut proposal_list.list, proposal);
        let vote_weight = table::borrow(&users.list, tx_context::sender(ctx));
        proposal.weight = proposal.weight + *vote_weight;
        proposal.last_voting_time = clock::timestamp_ms(clock);
    }

    public entry fun approve_proposal(proposal_list: &mut ProposalList, proposal: address, ctx: &mut TxContext) {
        let og_members = OGMEMBERS;
        assert!(vector::contains(&og_members, &tx_context::sender(ctx)), EINVALIDACCESS);
        let proposal = table::borrow_mut(&mut proposal_list.list, proposal);
        assert!(proposal.weight >= proposal.min_threshold, ENOTENOUGHVOTE);
        proposal.accepted = true;
    }

    public entry fun add_user_dao() {

    }

    public entry fun remove_user_dao() {
        
    }


}

