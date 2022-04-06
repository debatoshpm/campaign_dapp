import React from "react";
import Layout from "../../../../components/Layout";
import Link from "next/link";
import { Button, Table } from "semantic-ui-react";
import viewInstance from "../../../../ethereum/viewInstance";
import RequestRow from "../../../../components/RequestRow";

export async function getServerSideProps(context) {
  const { id } = context.query;
  const campaign = viewInstance(id);
  const reqCount = await campaign.methods.getRequestsCount().call();
  let requests = await Promise.all(
    Array(parseInt(reqCount))
      .fill()
      .map((_element, index) => {
        return campaign.methods.requests(index).call();
      })
  );
  requests = JSON.parse(JSON.stringify(requests));
  const approversCount = await campaign.methods.approversCount().call();
  return { props: { address: id, requests, reqCount, approversCount } };
}

export default ({ address, requests, reqCount, approversCount }) => {
  const RenderRow = () => {
    return requests.map((request, index) => {
      return (
        <RequestRow
          key={index}
          id={index}
          request={request}
          address={address}
          appCount={approversCount}
        />
      );
    });
  };
  return (
    <div>
      <Layout>
        <h3>Requests</h3>
        <Link href={`/campaigns/${address}/requests/new`}>
          <a>
            <Button floated="right" primary style={{ marginBottom: "10px" }}>
              Add Request
            </Button>
          </a>
        </Link>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>ID</Table.HeaderCell>
              <Table.HeaderCell>Description</Table.HeaderCell>
              <Table.HeaderCell>Amount</Table.HeaderCell>
              <Table.HeaderCell>Recipient</Table.HeaderCell>
              <Table.HeaderCell>Approval Count</Table.HeaderCell>
              <Table.HeaderCell>Approve</Table.HeaderCell>
              <Table.HeaderCell>Finalize</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <RenderRow />
          </Table.Body>
        </Table>
        <div>Found {reqCount} requests.</div>
      </Layout>
    </div>
  );
};
