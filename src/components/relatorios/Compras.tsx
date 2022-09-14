import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    PDFViewer,
    Image

} from "@react-pdf/renderer";

import moment from 'moment'

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
        fontSize: '8px',
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
        marginBottom: 5,
        fontWeight: 'extrabold',
        fontSize: '10px'
    },

    corpo: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '10px',
        padding: 5,
        borderBottomWidth: '0.5px',
        fontWeight: 'light',
        borderWidth: '1px',
        borderRadius: '5px'
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
        fontSize: '12px',
        borderTop: '0.5px',
        textAlign: 'center'
    },
    logo: {
        width: 74,
        height: 40,
    },
    assinaturas: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 55,
        fontSize: '10px',
        paddingHorizontal: '45px'
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
    },
    fotoTitulo: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '8px'
    },
    rodape: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '8px',
        paddingTop: '35px'
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
export default function BasicDocument({ compras }: CompraProps) {
    const data = moment().format('l')
    return (
        <PDFViewer style={styles.viewer}>
            {/* Start of the document*/}
            <Document title="Relatório de Compras">
                {/*render a single page*/}
                <Page size="A4" style={styles.page} wrap>


                    <View style={styles.fotoTitulo}>
                        <Image style={styles.logo} src="https://i.ibb.co/ZJpGsHm/noah.png" />
                        <Text>NOAH CONSTUCTIONS</Text>
                    </View>

                    <View style={styles.titulo}>
                        <Text>RELATÓRIO DE COMPRAS DE EQUIPAMENTOS DO DIA 12-09-2022</Text>
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
                    {
                        compras.length && compras.map((compra, index) => (
                            <View style={styles.corpo} key={index}>

                                <View style={styles.section}>
                                    <Text>{compra.equipamento_id.descricao}</Text>
                                </View>

                                <View style={styles.section}>
                                    <Text>{compra.preco}</Text>
                                </View>

                                <View style={styles.section}>
                                    <Text>{compra.quantidade_comprada}</Text>
                                </View>

                                <View style={styles.section}>
                                    <Text>{compra.data_compra}</Text>
                                </View>

                            </View>
                        ))
                    }


                    <View style={styles.assinaturas}>
                        <View>
                            <Text style={styles.assinaturaIndividual}>Responsável do Armazem</Text>
                        </View>
                        <View>
                            <Text style={styles.assinaturaIndividual}>Director NOAH</Text>
                        </View>


                    </View>

                    <View style={styles.rodape}>
                        <Text>Luanda aos, {data}</Text>
                    </View>


                </Page>
            </Document>
        </PDFViewer>
    );
}
