import React from "react";
import { Table, Button } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import viewInstance from "../ethereum/viewInstance";

export default ({ id, request, address, appCount }) => {
  const ready = request.approvalCount > appCount / 2;
  const onClick = async () => {
    const campaign = viewInstance(address);
    let accounts;
    if (window.ethereum) {
      accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
    } else {
      accounts = web3.eth.getAccounts();
    }
    await campaign.methods.approveRequest(id).send({
      from: accounts[0],
    });
  };
  const onFinalize = async () => {
    const campaign = viewInstance(address);
    let accounts;
    if (window.ethereum) {
      accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
    } else {
      accounts = web3.eth.getAccounts();
    }
    await campaign.methods.finalizeRequest(id).send({
      from: accounts[0],
    });
  };
  return (
    <Table.Row
      disabled={request.complete}
      positive={ready && !request.complete}
    >
      <Table.Cell>{id}</Table.Cell>
      <Table.Cell>{request.description}</Table.Cell>
      <Table.Cell>{web3.utils.fromWei(request.value, "ether")}</Table.Cell>
      <Table.Cell>{request.recipient}</Table.Cell>
      <Table.Cell>
        {request.approvalCount}/{appCount}
      </Table.Cell>
      <Table.Cell>
        {request.complete ? null : (
          <Button color="green" basic onClick={onClick}>
            Approve
          </Button>
        )}
      </Table.Cell>
      <Table.Cell>
        {request.complete ? null : (
          <Button color="teal" basic onClick={onFinalize}>
            Finalize
          </Button>
        )}
      </Table.Cell>
    </Table.Row>
  );
};
