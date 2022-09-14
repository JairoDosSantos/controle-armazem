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

        width: '30%',
        fontSize: '8px',
        textAlign: 'center'
    },
    total: {
        color: '#cd1212'
    },
    viewer: {
        width: window.innerWidth, //the pdf viewer will take up all of the width and height
        height: window.innerHeight,

    }, cabecalhoPrincipal: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '10px',
        padding: 5,
        fontWeight: 'light',
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
    textoCabecalho: {
        display: 'flex',
        flexDirection: 'column',
    }, corpoHeader: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '10px',
        padding: 5,
        fontWeight: 'light',

    },
    corpo: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '10px',
        padding: 5,
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
    divisaoAssinatura: {
        marginTop: 75
    },

    assinaturas: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '10px',
        paddingHorizontal: '20px',
        marginVertical: 20
    },
    assinaturaIndividual: {
        paddingVertical: 20,
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
    data: string
}

type ObraType = {
    id: number
    obra_nome: string;
    encarregado_id: number;
    estado: 'Activa' | 'Inactiva' | 'Concluida'
}

type AuditoriaType = {
    id: number;
    equipamento_id: EquipamentoType;
    obra_id: ObraType;
    data_retirada: string;
    quantidade_retirada: number;
    data_devolucao: string;
    quantidade_devolvida: number
}
type AuditoriaProps = {
    auditoria: AuditoriaType[];

}
// Create Document Component

export default function BasicDocument({ auditoria }: AuditoriaProps) {
    const data = moment().format('l')
    const ano = (new Date()).getFullYear()
    return (
        <PDFViewer style={styles.viewer} >
            {/* Start of the document*/}
            <Document title="Relatório de Movimentações">
                {/*render a single page*/}
                <Page size="A4" style={styles.page} >

                    <View style={styles.fotoTitulo}>
                        <View style={styles.textoCabecalho}>
                            <View style={{ marginBottom: 10 }}>
                                <Image style={styles.logo} src="https://i.ibb.co/ZJpGsHm/noah.png" />
                            </View>
                            <Text style={{ marginBottom: 4 }}>NIF:5484050782</Text>
                            <Text style={{ marginBottom: 4 }}>TEL.: 935519058</Text>
                            <Text style={{ marginBottom: 4 }}>ENDEREÇO: URBANIZAÇÃO BOA VIDA, Nº7, BAIRRO BENFICA</Text>
                        </View>
                        <View>
                            <Text>NOAH CONSTUCTIONS, Lda.</Text>

                        </View>
                    </View>

                    <View style={styles.titulo}>
                        <Text>GUIA DE TRANSPORTE Nº {`${auditoria.length} / ${ano}`}</Text>
                    </View>
                    <View style={{ border: 1, padding: 4, marginBottom: 10 }}>
                        <View style={styles.cabecalhoPrincipal}>

                            <View style={styles.section}>
                                <Text style={styles.textoTitulo}>Requisitante</Text>
                            </View>
                            <View style={styles.section}>
                                <Text style={styles.textoTitulo}>Aprovado por</Text>
                            </View>
                            <View style={styles.section}>
                                <Text style={styles.textoTitulo}>Empreteiro</Text>
                            </View>
                            <View style={styles.section}>
                                <Text>Endereço Casa</Text>
                            </View>

                            <View style={styles.section}>
                                <Text>Descrição do Extra</Text>
                            </View>

                        </View>

                        <View style={styles.corpoHeader}>

                            <View style={styles.section}>
                                <Text>{auditoria.length && auditoria[0].obra_id.obra_nome}</Text>
                            </View>
                            <View style={styles.section}>
                                <Text>Engº Fernando Alexandre</Text>
                            </View>
                            <View style={styles.section}>
                                <Text>NOAH</Text>
                            </View>
                            <View style={styles.section}>
                                <Text>{auditoria.length && auditoria[0].obra_id.obra_nome}</Text>
                            </View>

                            <View style={styles.section}>
                                <Text>exemplo</Text>
                            </View>

                        </View>
                    </View>


                    <View style={styles.cabecalho}>

                        <View style={styles.section}>
                            <Text style={styles.textoTitulo}>ID</Text>
                        </View>
                        <View style={styles.section}>
                            <Text style={styles.textoTitulo}>DESCRIÇÃO</Text>
                        </View>

                        <View style={styles.section}>
                            <Text>CENTRO DE CUSTO</Text>
                        </View>

                        <View style={styles.section}>
                            <Text>QTD</Text>
                        </View>



                    </View>
                    {
                        auditoria && auditoria.map((mov, index) => (
                            <View style={styles.corpo} key={index}>

                                <View style={styles.section}>
                                    <Text>{mov.equipamento_id.id}</Text>
                                </View>
                                <View style={styles.section}>
                                    <Text>{mov.equipamento_id.descricao}</Text>
                                </View>

                                <View style={styles.section}>
                                    <Text>{mov.obra_id.obra_nome}</Text>
                                </View>

                                <View style={styles.section}>
                                    <Text>{mov.quantidade_retirada}</Text>
                                </View>

                            </View>
                        ))
                    }

                    <View style={styles.divisaoAssinatura}>
                        <View style={styles.assinaturas}>

                            <View>
                                <Text style={styles.assinaturaIndividual}>Responsável do Armazem</Text>
                            </View>

                            <View>
                                <Text style={styles.assinaturaIndividual}>Director NOAH</Text>
                            </View>
                        </View>
                        <View style={styles.assinaturas}>

                            <View>
                                <Text style={styles.assinaturaIndividual}>Assinatura Transporte</Text>
                            </View>

                            <View>
                                <Text style={styles.assinaturaIndividual}>Assinatura Segurança</Text>
                            </View>
                        </View>
                        <View style={styles.assinaturas}>

                            <View>
                                <Text style={styles.assinaturaIndividual}>Assinatura Conferente</Text>
                            </View>

                            <View>
                                <Text style={styles.assinaturaIndividual}>Assinatura Solicitante</Text>
                            </View>
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