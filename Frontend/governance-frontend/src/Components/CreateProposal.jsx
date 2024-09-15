import { ConnectButton, useAccounts, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";

function CreateProposal() {
    const accounts = useAccounts();
    const { mutate: signAndExecute } = useSignAndExecuteTransaction();

    const submitUserProposal = async () => {
        const trx = new Transaction();
        trx.moveCall({
            target: `0x7c34c2a7802d2667959468c6bed348651cd4f5769b0293d6ef1a2fbe883b3754::governance::process_user_request`,
            arguments: [
                trx.pure.address('0xda4a99dc2473de94a1711b33cd18bbea7bf517ed432ea09c3e90e993ed6f5410'),
                trx.pure.bool(true),
                trx.object("0x784ff3291657915403f89ee82b452c1bc67c4d5713391c08b197236f18e3aa08"),
                trx.pure.u64(5),
                trx.object('0x3f8893c80424c7637cf6c6e333b29cc4f7ec7783c4c857cf5ca3ba5a36a8c87a'),
                trx.pure.u64(2)
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

    const VoteUserRequest = () => {
        const trx = new Transaction();
        trx.moveCall({
            target: `0x7c34c2a7802d2667959468c6bed348651cd4f5769b0293d6ef1a2fbe883b3754::governance::vote_user_request`,
            arguments: [
                trx.object('0x3f8893c80424c7637cf6c6e333b29cc4f7ec7783c4c857cf5ca3ba5a36a8c87a'),
                trx.pure.address('0xfded539127e6c2a6fa306cbd792ee73716059abe2ec102180cc28769c13c8375'),
                trx.object('0x784ff3291657915403f89ee82b452c1bc67c4d5713391c08b197236f18e3aa08'),
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
        const trx = new Transaction();
        trx.moveCall({
            target: `0x7c34c2a7802d2667959468c6bed348651cd4f5769b0293d6ef1a2fbe883b3754::governance::decide_user_action`,
            arguments: [
                trx.object('0x3f8893c80424c7637cf6c6e333b29cc4f7ec7783c4c857cf5ca3ba5a36a8c87a'),
                trx.pure.address(''),
                trx.object('0x784ff3291657915403f89ee82b452c1bc67c4d5713391c08b197236f18e3aa08'),
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
            target: `0x7c34c2a7802d2667959468c6bed348651cd4f5769b0293d6ef1a2fbe883b3754::governance::create_proposal`,
            arguments: [
                trx.pure.string('Upgrade Contract'),
                trx.object('0x5827cb580bac7db6d6dd545410e74b7b94f7055c39920d42c342210fd99fb09b'),
                trx.object('0xe66a35cc7ab654e727a02ea78fb2dac4c2c17aa982443b835f7d80d4f297cace'),
                trx.pure.u64(10),
                trx.object('0x784ff3291657915403f89ee82b452c1bc67c4d5713391c08b197236f18e3aa08'),
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
