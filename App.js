/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

// BEGIN SAMPLE CODE

// POLYFILLS FOR BUFFER & RANDOM VALUES
import 'react-native-get-random-values'; // need to execute npx pod-install
import buffer from 'buffer';
window.Buffer = buffer.Buffer;

import KeyEncoder from 'key-encoder';
import {ec as EC, curves} from 'elliptic';
import {sha256} from 'react-native-sha256'; // need to be linked

const ec = new EC(curves.p256);
const keyEncoder = new KeyEncoder({
  curveParameters: [1, 2, 840, 10045, 3, 1, 7],
  privatePEMOptions: {label: 'EC PRIVATE KEY'},
  publicPEMOptions: {label: 'PUBLIC KEY'},
  curve: ec,
});

/* register: do once when registering pin */
const key = ec.genKeyPair();

// store this private key in secure storage
// load later with ec.keyFromPrivate(priv)
const priv = key.getPrivate('hex');

// send public key to server in base64-encoded pem (`public_key` field)
const pub = key.getPublic('hex');
const pemPub = keyEncoder.encodePublic(pub, 'raw', 'pem');
const b64pem = Buffer.from(pemPub).toString('base64');
/* end register */

// to sign message, hash with sha256
// need to concatenate message with nonce first (TBD)
const message = 'test';
sha256(message).then(hash => {
  const signed = key.sign(hash, 'hex').toDER('hex');

  // send signed result as `signature` field
  console.log('sign', signed);
});

const Section = ({children, title}): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.jsx</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
