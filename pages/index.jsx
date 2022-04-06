import React from "react";
import { Button, Card } from "semantic-ui-react";
import instance from "../ethereum/instance";
import Layout from "../components/Layout";
import Link from "next/link";

export async function getServerSideProps() {
  const campaigns = await instance.methods.getDeployedCampaigns().call();
  return { props: { campaigns } };
}

const renderCampaign = (campaigns) => {
  const items = campaigns.map((address) => {
    return {
      header: address,
      description: (
        <Link href={`/campaigns/${address}`}>
          <a>View Campaigns</a>
        </Link>
      ),
      fluid: true,
    };
  });
  return <Card.Group items={items} />;
};

const index = ({ campaigns }) => {
  return (
    <div>
      <Layout>
        <h3>Open Campaigns</h3>
        <Link href="/campaigns/new">
          <Button
            floated="right"
            content="Create Campaign"
            icon="add circle"
            primary
          />
        </Link>
        {renderCampaign(campaigns)}
      </Layout>
    </div>
  );
};

export default index;
