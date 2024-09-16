import { ConnectButton, useAccounts, useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";

function CreateProposal() {
    const accounts = useAccounts();
    const suiClient = useSuiClient();
    const { mutate: signAndExecute } = useSignAndExecuteTransaction();
    const MY_ADDRESS =
        "0x19088d857606c202fd57ab581e1842e5b87fa90340128ce44abcc62cb5185f37";

    const submitUserProposal = async () => {
        const trx = new Transaction();
        
        trx.moveCall({
            target: `0x5ba420c8f49ccf8589f42169a68039ff0370414b7c5fbd0a316eaf4ea73b9f27::governance::process_user_request`,
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

    const retrieve_proposals = async () => {
        console.log("clicked")
        const proposal_details = (await suiClient.getObject({
            id: '0x6d98f83c8bce3e6c0081ec264fb5f24301050e4e1f86e3a60088e44cbbd1232d',
            options: {
                showContent: true,
                showDisplay: true,
                showOwner: true,
              },
        }));
    
        const dynamicContentLinks = await suiClient.getDynamicFields({
          parentId: proposal_details.data?.content?.fields?.list?.fields?.id?.id,
        });
    
        const allSocialsObjectIds = dynamicContentLinks?.data.map((elm) => elm.objectId);

        let contentLinks = (await suiClient.multiGetObjects({
            ids: allSocialsObjectIds,
            options: {
              showContent: true,
            },
          }));

        console.log(contentLinks)
    }

    const VoteUserRequest = () => {
        const trx = new Transaction();
        trx.moveCall({
            target: `0x5ba420c8f49ccf8589f42169a68039ff0370414b7c5fbd0a316eaf4ea73b9f27::governance::vote_user_request`,
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
            target: `0x5ba420c8f49ccf8589f42169a68039ff0370414b7c5fbd0a316eaf4ea73b9f27::governance::decide_user_action`,
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
            target: `0x5ba420c8f49ccf8589f42169a68039ff0370414b7c5fbd0a316eaf4ea73b9f27::governance::create_proposal`,
            arguments: [
                trx.pure.string('New Voting Mechanism'),
                trx.object('0xa5e8b306f2126f8c78d630d6c41c9c7510f0389fa735004eeba78451b9aa112b'),
                trx.object('0x6d98f83c8bce3e6c0081ec264fb5f24301050e4e1f86e3a60088e44cbbd1232d'),
                trx.pure.u64(250),
                trx.object('0xc9950a30ee8a4315c924031a0651bb12ae1320345d2d44224da36247997b96ee'),
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

    const retrievePublicKey = async () => {
        const trx = new Transaction();
        trx.moveCall({
            target: `0x9222f45aa00b2712c027b37bad31342fedb52de1d9aa049bca67e935c5e2e5dc::protocol::get_public_key`,
            arguments: [
                trx.object('0xd82471a9da34b6d5bc0c2736ce05a268936ce5a6714d1e6e917a82817232ae44'),
                trx.pure.string("Ariful Afridi"),
            ]
        });

        const res = await suiClient.devInspectTransactionBlock({
            sender: MY_ADDRESS,
            transactionBlock: trx,
        });

        console.log(res)
    }

    const retrieveUsers  = async() => {
        const trx = new Transaction();
        trx.moveCall({
            target: `0x9222f45aa00b2712c027b37bad31342fedb52de1d9aa049bca67e935c5e2e5dc::protocol::get_all_usernames`,
            arguments: [
                trx.object('0xd82471a9da34b6d5bc0c2736ce05a268936ce5a6714d1e6e917a82817232ae44'),
            ]
        });

        const res = await suiClient.devInspectTransactionBlock({
            sender: MY_ADDRESS,
            transactionBlock: trx,
        });

        console.log(res)
    }

    const retrieveBlobid = async () => {
        const trx = new Transaction();
        trx.moveCall({
            target: `0x9222f45aa00b2712c027b37bad31342fedb52de1d9aa049bca67e935c5e2e5dc::protocol::get_blob_ids`,
            arguments: [
                trx.object('0x478f4467244032f0d8c79eeaa72084aedc32b87f4efc28a979f6f7718f8fa481'),
                trx.pure.string("abcwallet")
            ]
        });

        const res = await suiClient.devInspectTransactionBlock({
            sender: MY_ADDRESS,
            transactionBlock: trx,
        });

        console.log(res)
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


            <div className="my-4">
                <button
                    onClick={retrievePublicKey}
                    className="btn btn-active btn-secondary"
                >Get Public Key</button>
            </div>
            
            <div>
            <button
                    onClick={retrieveBlobid}
                    className="btn btn-active btn-secondary"
                >Get All Users</button>
            </div>

            <div>
            <button
                    onClick={retrieve_proposals}
                    className="btn btn-active btn-secondary"
                >Get All Proposals</button>
            </div>

        </div>
    );
}
export default CreateProposal;
