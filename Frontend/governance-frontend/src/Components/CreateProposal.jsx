import { ConnectButton, useAccounts, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";

function CreateProposal() {
    const accounts = useAccounts();
    const { mutate: signAndExecute } = useSignAndExecuteTransaction();

    const submitUserProposal = async () => {
        const trx = new Transaction();
        trx.moveCall({
            target: `0x8b5d308b7a50c6542c3ef28ec84bb9962be5078c9e46e8f41ff262f87ddb3cf2::governance::process_user_request`,
            arguments: [
                trx.pure.address('0xda4a99dc2473de94a1711b33cd18bbea7bf517ed432ea09c3e90e993ed6f5410'),
                trx.pure.bool(true),
                trx.object("0xc4132aac7d00f91ab855a48f8a7b6ef72a441d8ba26240c3fc6a515f6eebb48c"),
                trx.pure.u64(5),
                trx.object('0xadb0fb8d0e715763a4359dee593ee268e6a5b113dea803b548c1c7b129df6f41'),
                trx.pure.u64(2)
            ]
        });

        signAndExecute(
            {
                transaction: trx,
            },
            {
                onSuccess: () => {
                    console.log("Transaction Successful")
                }
            },
            {
                onError: (err) => {
                    console.log(err)
                }
            }
        );
    }

    const VoteUserRequest = () => {
        const trx = new Transaction();
        trx.moveCall({
            target: `0x8b5d308b7a50c6542c3ef28ec84bb9962be5078c9e46e8f41ff262f87ddb3cf2::governance::vote_user_request`,
            arguments: [
                trx.object('0xadb0fb8d0e715763a4359dee593ee268e6a5b113dea803b548c1c7b129df6f41'),
                trx.pure.address('0xd6fe0d5ffb1a84110cfd1f28749de6082d9c93f98c4587b7f1b8100e98ccf444'),
                trx.object('0xc4132aac7d00f91ab855a48f8a7b6ef72a441d8ba26240c3fc6a515f6eebb48c'),
                trx.object('0x0000000000000000000000000000000000000000000000000000000000000006')
            ]
        });

        signAndExecute(
            {
                transaction: trx,
            },
            {
                onError: (err) => {
                    console.log(err)
                }
            }
        );
    }

    const handleUserRequest = () => {
        console.log("Checked")
        const trx = new Transaction();
        trx.moveCall({
            target: `0x8b5d308b7a50c6542c3ef28ec84bb9962be5078c9e46e8f41ff262f87ddb3cf2::governance::decide_user_action`,
            arguments: [
                trx.object('0xadb0fb8d0e715763a4359dee593ee268e6a5b113dea803b548c1c7b129df6f41'),
                trx.pure.address('0xd6fe0d5ffb1a84110cfd1f28749de6082d9c93f98c4587b7f1b8100e98ccf444'),
                trx.object('0xc4132aac7d00f91ab855a48f8a7b6ef72a441d8ba26240c3fc6a515f6eebb48c'),
            ]
        });

        signAndExecute(
            {
                transaction: trx,
            },
            {
                onError: (err) => {
                    console.log(err)
                }
            }
        );
    }

    const submitNewProposal = () => {
        const trx = new Transaction();
        trx.moveCall({
            target: `0x8b5d308b7a50c6542c3ef28ec84bb9962be5078c9e46e8f41ff262f87ddb3cf2::governance::create_proposal`,
            arguments: [
                trx.pure.string('Upgrade Contract'),
                trx.object('0x5827cb580bac7db6d6dd545410e74b7b94f7055c39920d42c342210fd99fb09b'),
                trx.object('0x0d57fde709b268425877781221c1a2c06d270f5c9a281f0fb30a381cf3c0f833'),
                trx.pure.u64(10),
                trx.object('0xc4132aac7d00f91ab855a48f8a7b6ef72a441d8ba26240c3fc6a515f6eebb48c'),
            ]
        });

        signAndExecute(
            {
                transaction: trx,
            },
            {
                onError: (err) => {
                    console.log(err)
                }
            }
        );
    }


    return (
        <div>
            <div>
                <ConnectButton />
                <h2>Available accounts:</h2>
                {accounts.length === 0 && <div>No accounts detected</div>}
                <ul>
                    {accounts.map((account) => (
                        <li key={account.address}>- {account.address}</li>
                    ))}
                </ul>
            </div>

            {/* -----------Create Proposal-------------- */}

            <div className="my-4">
                <button
                    onClick={submitNewProposal}
                    className="btn btn-active btn-primary"
                >Create a new Proposal</button>
            </div>


            <div className="my-4">
                <button
                    onClick={submitUserProposal}
                    className="btn btn-active btn-primary"
                >Request to Add New User</button>
            </div>


            <div className="my-4">
                <button
                    onClick={VoteUserRequest}
                    className="btn btn-active btn-secondary"
                >Vote on User Request</button>
            </div>

            <div className="my-4">
                <button
                    onClick={handleUserRequest}
                    className="btn btn-active btn-secondary"
                >Approve or Decline User Request</button>
            </div>


        </div>
    );
}
export default CreateProposal;
