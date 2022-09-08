import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    PDFViewer,
    PDFDownloadLink,
    Image

} from "@react-pdf/renderer";

import logo from '../../assets/noah.png'

// Create styles
const styles = StyleSheet.create({
    page: {
        backgroundColor: "#ffff",
        color: "black",
        padding: 30
    },
    section: {
        paddingHorizontal: 2,
        borderColor: '#f6f6f',
        width: '30%',
        fontSize: '10px',
        textAlign: 'center'

    },
    viewer: {
        width: window.innerWidth, //the pdf viewer will take up all of the width and height
        height: window.innerHeight,
        zIndex: 0
    },
    cabecalho: {
        backgroundColor: '#D3D3D3',
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderBottomWidth: '0.5px',
        borderTopWidth: '0.5px',
        textAlign: 'center',
        marginBottom: 5
    },

    corpo: {

        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '15px',
        padding: 5,
        borderBottomWidth: '0.5px',
        fontWeight: 'light'
    },
    titulo: {

        fontWeight: 'ultrabold',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 8,
        paddingTop: 15,
        paddingBottom: 4,
        fontSize: '14px',
        borderTop: '0.5px',
        textAlign: 'center'
    },
    logo: {
        width: 74,
        height: 40,
        marginLeft: 'auto',
        marginRight: 'auto',
        borderWidth: 1
    },
    assinaturas: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 55,
        fontSize: '10px',
    },
    assinaturaIndividual: {
        paddingVertical: 10,
        paddingHorizontal: 25,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderTop: 1
    },
    textoTitulo: {
        fontWeight: 'bold'
    }

});


type EquipamentoType = {
    id: number;
    descricao: string;
    duracao_id: number;
    classificacao_id: number;
    data: string;
    stock_emergencia: number
}

type CompraType = {
    id: number;
    equipamento_id: EquipamentoType;
    preco: number;
    data_compra: string;
    quantidade_comprada: number
}

type CompraProps = {
    compras: CompraType[];
}

// Create Document Component
export default function BasicDocument() {

    const compras: CompraProps[] = []

    return (
        <PDFViewer style={styles.viewer}>
            {/* Start of the document*/}
            <Document title="Relatório de Compras">
                {/*render a single page*/}
                <Page size="A4" style={styles.page}>

                    <Image style={styles.logo} src='https://images2.imgbox.com/cd/ab/d3WKdgPQ_o.png' />

                    <View style={styles.titulo}>
                        <Text>COMPRAS DE EQUIPAMENTOS</Text>
                    </View>

                    <View style={styles.cabecalho}>

                        <View style={styles.section}>
                            <Text style={styles.textoTitulo}>Descrição</Text>
                        </View>

                        <View style={styles.section}>
                            <Text>Preço</Text>
                        </View>


                        <View style={styles.section}>
                            <Text>Quantidade</Text>
                        </View>
                        <View style={styles.section}>
                            <Text>Data de compra</Text>
                        </View>

                    </View>
                    <View style={styles.corpo}>

                        <View style={styles.section}>
                            <Text>Bloco de 12</Text>
                        </View>

                        <View style={styles.section}>
                            <Text>AKWZ 1.200,00</Text>
                        </View>

                        <View style={styles.section}>
                            <Text>10</Text>
                        </View>

                        <View style={styles.section}>
                            <Text>2022-02-07</Text>
                        </View>

                    </View>
                    <View style={styles.corpo}>

                        <View style={styles.section}>
                            <Text>Bloco de 12</Text>
                        </View>

                        <View style={styles.section}>
                            <Text>AKWZ 1.200,00</Text>
                        </View>

                        <View style={styles.section}>
                            <Text>10</Text>
                        </View>
                        <View style={styles.section}>
                            <Text>2022-02-07</Text>
                        </View>


                    </View>


                    <View style={styles.assinaturas}>
                        <View>
                            <Text style={styles.assinaturaIndividual}>Responsável do Armazem</Text>
                        </View>
                        <View>
                            <Text style={styles.assinaturaIndividual}>Director NOAH</Text>
                        </View>


                    </View>


                </Page>
            </Document>
        </PDFViewer>
    );
}
