
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
    const EALREADYDAOMEMBER: u64 = 14;
    const EALREADYACCEPTED: u64 = 15;
    const EALREADYVOTED: u64 = 16;

    public struct Proposal has key, store {
        id: UID,
        name: String,
        blob: Blob,
        accepted: bool,
        min_threshold: u64,
        weight: u64,
        last_voting_time: u64,
        voter_list: Table<address, bool>
    }

    public struct ProposalList has key {
        id: UID,
        list: Table<ID, Proposal>,
    }

    public struct Users has key, store {
        id: UID,
        list: Table<address, u64>
    }

    public struct UserRequestList has key {
        id: UID,
        list: Table<ID, HandleUser>
    }

    public struct HandleUser has key, store {
        id: UID,
        user_key: address,
        add: bool,
        vote_weight: u64,
        proposed_user_weght: u64,
        min_threshold: u64,
        last_voting_time: u64,
        voter_list: Table<address, bool>
    }


    fun init(ctx: &mut TxContext) {

        let proposal_list = ProposalList {
            id: object::new(ctx),
            list: table::new(ctx),
        };

        let user_request_list = UserRequestList {
            id: object::new(ctx),
            list: table::new(ctx),
        };

        let mut users = Users {
            id: object::new(ctx),
            list: table::new(ctx),
        };

        let og_members = OGMEMBERS;

        let mut i: u64 = 0;
        while(i < vector::length(&og_members)) {
            let element = vector::borrow(&og_members, i);
            table::add(&mut users.list, *element, 10);
            i = i + 1;
        };

        transfer::share_object(proposal_list);
        transfer::share_object(user_request_list);
        transfer::share_object(users);
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
            last_voting_time: 0,
            voter_list: table::new(ctx)
        };
        table::add(&mut proposal_list.list, object::uid_to_inner(&new_proposal.id), new_proposal);
    }

    public entry fun vote_proposal(proposal_list: &mut ProposalList, proposal: ID, users: &Users, clock: &Clock, ctx: &mut TxContext) {
        assert!(table::contains(&users.list, tx_context::sender(ctx)), ENOTDAOMEMBER);
        assert!(table::contains(&proposal_list.list, proposal), ENOTVALIDPROPOSAL); 
        let proposal = table::borrow_mut(&mut proposal_list.list, proposal);
        assert!(table::contains(&proposal.voter_list, tx_context::sender(ctx)), EALREADYVOTED);
        let vote_weight = table::borrow(&users.list, tx_context::sender(ctx));
        proposal.weight = proposal.weight + *vote_weight;
        proposal.last_voting_time = clock::timestamp_ms(clock);
        table::add(&mut proposal.voter_list, tx_context::sender(ctx), true);
    }

    public entry fun approve_proposal(proposal_list: &mut ProposalList, proposal: ID, ctx: &mut TxContext) {
        let og_members = OGMEMBERS;
        assert!(vector::contains(&og_members, &tx_context::sender(ctx)), EINVALIDACCESS);
        let proposal = table::borrow_mut(&mut proposal_list.list, proposal);
        assert!(proposal.weight >= proposal.min_threshold, ENOTENOUGHVOTE);
        assert!(proposal.accepted == false, EALREADYACCEPTED);
        proposal.accepted = true;
    }

    public entry fun process_user_request(
        user_key: address, 
        add: bool, users: &Users, 
        min_threshold: u64, 
        user_request_list: &mut UserRequestList,
        proposed_user_weght: u64,
        ctx: &mut TxContext
        ) {
        assert!(table::contains(&users.list, tx_context::sender(ctx)), ENOTDAOMEMBER);
        if(add) {
           assert!(table::contains(&users.list, user_key) == false, EALREADYDAOMEMBER);
        } else {
            assert!(table::contains(&users.list, user_key), ENOTDAOMEMBER);
        };
        let new_request = HandleUser {
            id: object::new(ctx),
            user_key,
            add,
            vote_weight: 0,
            proposed_user_weght,
            min_threshold,
            last_voting_time: 0,
            voter_list: table::new(ctx)
        };
        table::add(&mut user_request_list.list, object::uid_to_inner(&new_request.id), new_request);
    }

    public entry fun vote_user_request(
        user_request_list: &mut UserRequestList,
        user_request: ID,
        users: &Users, 
        clock: &Clock, 
        ctx: &mut TxContext
    ) {
        assert!(table::contains(&users.list, tx_context::sender(ctx)), ENOTDAOMEMBER);
        assert!(table::contains(&user_request_list.list, user_request), ENOTVALIDPROPOSAL);
        let request = table::borrow_mut(&mut user_request_list.list, user_request);
        assert!(table::contains(&request.voter_list, tx_context::sender(ctx)), EALREADYVOTED);
        let vote_weight = table::borrow(&users.list, tx_context::sender(ctx));
        request.vote_weight = request.vote_weight + *vote_weight;
        request.last_voting_time = clock::timestamp_ms(clock);
        table::add(&mut request.voter_list, tx_context::sender(ctx), true);
    }

    public entry fun decide_user_action(
        user_request_list: &mut UserRequestList,
        user_request: ID,
        users: &mut Users,
        ctx: &mut TxContext
    ) {
        let og_members = OGMEMBERS;
        assert!(vector::contains(&og_members, &tx_context::sender(ctx)), EINVALIDACCESS);
        let request = table::borrow_mut(&mut user_request_list.list, user_request);
        assert!(request.vote_weight >= request.min_threshold, ENOTENOUGHVOTE);
        if(request.add) {
            table::add(&mut users.list, request.user_key, request.proposed_user_weght);
        } else {
            table::remove(&mut users.list, request.user_key);
        };
    }

}

