import React, { useState } from "react";
import { useRouter } from "next/router";
import { Button, Form, Input, Message } from "semantic-ui-react";
import viewInstance from "../ethereum/viewInstance";
import web3 from "../ethereum/web3";

const Contribute = ({ address }) => {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const onSubmit = async (event) => {
    event.preventDefault();
    const campaign = viewInstance(address);
    setLoading(true);
    setError("");
    try {
      let accounts;
      if (window.ethereum) {
        accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
      } else {
        accounts = web3.eth.getAccounts();
      }
      console.log(accounts[0]);
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(value, "ether"),
      });
      router.replace(`/campaigns/${address}`);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
    setValue("");
  };
  return (
    <Form onSubmit={onSubmit} error={!!error}>
      <Form.Field>
        <label>Ammount to Contribute</label>
        <Input
          label="ether"
          labelPosition="right"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        ></Input>
      </Form.Field>
      <Message error header="Oops!" content={error} />
      <Button loading={loading} primary>
        Contribute!
      </Button>
    </Form>
  );
};

export default Contribute;
