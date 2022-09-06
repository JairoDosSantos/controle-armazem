import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import dynamic from 'next/dynamic';

/**
 * const PDFViewer = dynamic(() => import(" @react-pdf/renderer "), {
    ssr: false
});
 */
import ReactPDF from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: { backgroundColor: 'tomato' },
    section: { color: 'white', textAlign: 'center', margin: 30 }
});

export const ComprasReport = () => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.section}>
                <Text>Section #1</Text>
            </View>
        </Page>
    </Document>
);

ReactPDF.render(<ComprasReport />, `${__dirname}/example.pdf`);
