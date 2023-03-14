import {
    Document, Image, Page, PDFDownloadLink, StyleSheet, Text,
    View
} from "@react-pdf/renderer";

import moment from 'moment';
import { FaPrint } from "react-icons/fa";
// Create styles
const styles = StyleSheet.create({
    page: {
        backgroundColor: "#ffff",
        color: "black",
        paddingHorizontal: 30,
        paddingTop: 30,
        paddingBottom: 66
    },
    section: {
        paddingHorizontal: 2,
        borderColor: '#f6f6f',
        width: '30%',
        fontSize: '8px',
        textAlign: 'center'
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
        paddingBottom: 20,
        paddingHorizontal: 25,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottom: 1
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
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
        fontSize: '8px',
        height: 45,
    },
    numPagina: {
        position: 'absolute',
        bottom: '30px',
        right: '40px',
        fontSize: '8px',
    }

});

type ButtonType = {
    compras: CompraType[];
    legenda: string
}


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
    quantidade_comprada: number;
    estado: string
}

type CompraProps = {
    compras: CompraType[];
}

// Create Document Component
export function RelatorioCompra({ compras }: CompraProps) {
    const data = moment().format("DD/MM/yyyy")
    {/* Start of the document*/ }
    return (


        <Document title="Relatório de Compras" author="Jairo dos Santos" >
            {/*render a single page*/}
            < Page size="A4" style={styles.page} wrap >


                <View style={styles.fotoTitulo}>
                    <Image style={styles.logo} src="https://i.ibb.co/ZJpGsHm/noah.png" />
                    <View style={styles.rodape}>
                        <Text >NOAH CONSTRUCTIONS, LDA.</Text>
                        <Text >Data emissão: {data}</Text>
                    </View>
                </View>

                <View style={styles.titulo}>
                    <Text>RELATÓRIO DE COMPRAS DE EQUIPAMENTOS</Text>
                </View>

                <View style={styles.cabecalho}>

                    <View style={styles.section}>
                        <Text style={styles.textoTitulo}>Descrição</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.textoTitulo}>Estado</Text>
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
                        <View style={styles.corpo} key={index} wrap={false}>

                            <View style={styles.section}>
                                <Text>{compra.equipamento_id.descricao}</Text>
                            </View>
                            <View style={styles.section}>
                                <Text>{compra.estado}</Text>
                            </View>
                            <View style={styles.section}>
                                <Text>{compra.preco.toLocaleString('pt', {
                                    style: 'currency',
                                    currency: 'KWZ'
                                })}</Text>
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
                        <Text style={styles.assinaturaIndividual}>Responsável do Armazém</Text>
                    </View>
                    <View>
                        <Text style={styles.assinaturaIndividual}>Director NOAH</Text>
                    </View>


                </View>
                <Text
                    style={styles.numPagina}
                    render={({ pageNumber, totalPages }) => (`Página ${pageNumber} de ${totalPages}`)}
                    fixed />
            </Page >
        </Document >

    );
}

const LinkDonwloadExtratoDeCarregamentoDeCartao = ({ compras, legenda }: ButtonType) => (
    <PDFDownloadLink
        className='bg-gray-700 text-white px-4 py-2 shadow font-bold flex items-center gap-2 hover:brightness-75'
        document={<RelatorioCompra compras={compras} />}
    >
        {({ blob, url, loading, error }) =>
            loading ?
                <>

                    <span>loading...</span>
                </>
                : <>
                    <FaPrint />
                    <span>{legenda}</span>
                </>
        }

    </PDFDownloadLink >)

export default LinkDonwloadExtratoDeCarregamentoDeCartao;