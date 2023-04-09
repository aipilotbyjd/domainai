import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, List, Accordion } from "react-native-paper";
import axios from "axios";

const BusinessNameGenerator = () => {
  const [keywords, setKeywords] = useState("");
  const [businessNames, setBusinessNames] = useState([]);
  const [domainNames, setDomainNames] = useState([]);

  const generateBusinessNames = async () => {
    try {
      const response = await axios.get(
        `https://api.businessnamegenerator.com/v1.0/businessnames?query=${keywords}`
      );
      setBusinessNames(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const checkDomainAvailability = async (businessName) => {
    try {
      const response = await axios.get(
        `https://api.domainr.com/v2/status?domain=${businessName}.com`
      );
      const available = response.data.status[0].status === "inactive";
      setDomainNames((domainNames) => [
        ...domainNames,
        { name: businessName, available },
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  const renderItem = ({ item }) => (
    <List.Item
      title={item}
      onPress={() => checkDomainAvailability(item)}
      right={() =>
        domainNames.find((domain) => domain.name === item) && (
          <List.Icon
            color={
              domainNames.find((domain) => domain.name === item).available
                ? "green"
                : "red"
            }
            icon="check-circle"
          />
        )
      }
    />
  );

  const renderAccordion = () => (
    <Accordion title="Available Domain Names">
      <List.Section>
        {businessNames.map((businessName) =>
          renderItem({ item: businessName })
        )}
      </List.Section>
    </Accordion>
  );

  return (
    <View style={styles.container}>
      <TextInput
        label="Keywords"
        value={keywords}
        onChangeText={setKeywords}
        style={styles.input}
      />
      <Button mode="contained" onPress={generateBusinessNames}>
        Generate Business Names
      </Button>
      {domainNames.length > 0 && renderAccordion()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
});

export default BusinessNameGenerator;
