module walrusmultisig::protocol {
    use sui::table::{Self, Table};
    use std::string::{String};

    // Error codes
    const EUsernameExists: u64 = 1;
    const EUserNotFound: u64 = 2;
    const EMultisigNotFound: u64 = 3;

    // Resource for registering users with usernames and public keys
    public struct UserRegistry has key, store {
        id: UID,
        usernames: Table<String, String>, // Maps username -> public key
        all_usernames: vector<String>,
    }

    // Resource for registering multisig names with associated blob IDs
    public struct MultisigRegistry has key, store {
        id: UID,
        multisigs: Table<String, vector<String>>, // Maps multisig name -> blob ID array
    }

    /// Create and initialize both registries
    fun init(ctx: &mut TxContext) {
        let user_registry = UserRegistry {
            id: object::new(ctx),
            usernames: table::new(ctx),
             all_usernames: vector::empty<String>()
        };
        
        let multisig_registry = MultisigRegistry {
            id: object::new(ctx),
            multisigs: table::new(ctx),
        };
        transfer::public_share_object(user_registry);
        transfer::public_share_object(multisig_registry);

    }

    /// Add a new unique username with its associated public key to the UserRegistry
    public entry fun add_user(user_registry: &mut UserRegistry, username: String, public_key: String) {
        assert!(table::contains(&user_registry.usernames, username) == false, EUsernameExists); // Ensure username is unique
        table::add(&mut user_registry.usernames, username, public_key);
        vector::push_back(&mut user_registry.all_usernames, username);
    }

    /// Add a new blob ID to an existing multisig or create a new one if it doesn't exist
    public entry fun add_multisig_blob(multisig_registry: &mut MultisigRegistry, multisig_name: String, blob_id: String) {
        if (!table::contains(&multisig_registry.multisigs, multisig_name)) {
            table::add(&mut multisig_registry.multisigs, multisig_name, vector::empty<String>());
        };
        let blob_ids = table::borrow_mut(&mut multisig_registry.multisigs, multisig_name);
        vector::push_back(blob_ids, blob_id);
    }

    /// Retrieve all usernames from the UserRegistry
    public entry fun get_all_usernames(user_registry: &UserRegistry): vector<String> {
        user_registry.all_usernames
    }

    /// Retrieve the public key for a given username
    public entry fun get_public_key(user_registry: &UserRegistry, username: String): String {
        assert!(table::contains(&user_registry.usernames, username), EUserNotFound); // Ensure the username exists
        *table::borrow(&user_registry.usernames, username)
    }

    /// Retrieve the array of blob IDs for a given multisig
    public entry fun get_blob_ids(multisig_registry: &MultisigRegistry, multisig_name: String): vector<String> {
        assert!(table::contains(&multisig_registry.multisigs, multisig_name), EMultisigNotFound); // Ensure the multisig exists
        *table::borrow(&multisig_registry.multisigs, multisig_name)
    }
}
