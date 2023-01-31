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
        height: 40
    },
    assinaturas: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
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
        height: 45
    },
    numPagina: {
        position: 'absolute',
        bottom: '30px',
        right: '40px',
        fontSize: '8px',
    }
});

type EquipamentoType = {
    id: number;
    descricao: string;
    duracao_id: number;
    classificacao_id: number;
    data: string
}

type EquipamentosARMType = {
    id: number;
    quantidade: number;
    equipamento_id: EquipamentoType;
    data_aquisicao: string;
    estado: string
}
type DuracaoType = {
    id: number;
    tempo: string;

}
type ClassificacaoType = {
    id: number;
    tipo: string;

}

type PosicaoArmazemProps = {
    equipamentosARM: EquipamentosARMType[];
    duracao: DuracaoType[];
    classificacao: ClassificacaoType[]
}

// Create Document Component
export default function BasicDocument({ equipamentosARM, duracao, classificacao }: PosicaoArmazemProps) {

    const data = moment().format("DD/MM/yyyy")
    const numRelatorio = ((equipamentosARM.length - 100) / (new Date()).getHours()) + 1;
    //Funções
    const findDuracao = (id: number) => {
        const duration = (duracao && duracao.length)
            ? duracao.find((dur) => (dur.id === id))
            : []

        return duration as DuracaoType
    }

    const findClassificacao = (id: number) => {
        const classification = (classificacao && classificacao.length)
            ? classificacao.find((classific) => (classific.id === id))
            : []
        return classification as ClassificacaoType
    }
    return (
        <PDFViewer style={styles.viewer}>
            {/* Start of the document*/}
            <Document title="Relatório de Equipamentos em armazem">
                {/*render a single page*/}
                <Page size="A4" style={styles.page} wrap={false}>

                    {/**
                        * <a href="https://imgbox.com/d3WKdgPQ" target="_blank"><img src="https://images2.imgbox.com/cd/ab/d3WKdgPQ_o.png" alt="image host"/></a>
                     */}
                    <View style={styles.fotoTitulo}>
                        <Image style={styles.logo} src="https://i.ibb.co/ZJpGsHm/noah.png" />
                        <View style={styles.rodape}>
                            <Text >NOAH CONSTRUCTIONS, LDA.</Text>
                            <Text >Data emissão: {data}</Text>
                        </View>
                    </View>

                    <View style={styles.titulo}>
                        <Text>RELATÓRIO DE EQUIPAMENTOS EM ARMAZÉM - {Math.floor(numRelatorio)}/{(new Date()).getFullYear()}
                        </Text>
                    </View>

                    <View style={styles.cabecalho}>

                        <View style={styles.section}>
                            <Text style={styles.textoTitulo}>Descrição</Text>
                        </View>
                        <View style={styles.section}>
                            <Text style={styles.textoTitulo}>Estado</Text>
                        </View>
                        <View style={styles.section}>
                            <Text>Classificação</Text>
                        </View>

                        <View style={styles.section}>
                            <Text>Tempo de duração</Text>
                        </View>

                        <View style={styles.section}>
                            <Text>Quantidade</Text>
                        </View>

                    </View>

                    <View >
                        {equipamentosARM && equipamentosARM.map((armazem, index) => {
                            if (armazem.quantidade > 0) {
                                return (

                                    <View style={styles.corpo} key={index} wrap={false} >

                                        <View style={styles.section}>
                                            <Text>{armazem.equipamento_id.descricao}</Text>
                                        </View>
                                        <View style={styles.section}>
                                            <Text>{armazem.estado}</Text>
                                        </View>
                                        <View style={styles.section}>
                                            <Text>{findClassificacao(armazem.equipamento_id.classificacao_id).tipo}</Text>
                                        </View>

                                        <View style={styles.section}>
                                            <Text>{findDuracao(armazem.equipamento_id.duracao_id).tempo}</Text>
                                        </View>

                                        <View style={styles.section}>
                                            <Text>{armazem.quantidade}</Text>
                                        </View>
                                    </View>

                                )
                            }
                        })
                        }
                    </View>

                    <View style={styles.assinaturas}>
                        <View>
                            <Text style={styles.assinaturaIndividual}>Responsável do Armazém</Text>
                        </View>
                        {
                            /**
                           *   <View>
                                    <Text style={styles.assinaturaIndividual}>Director NOAH</Text>
                                </View>
                           */
                        }

                    </View>
                    <Text
                        style={styles.numPagina}
                        render={({ pageNumber, totalPages }) => (`Página ${pageNumber} de ${totalPages}`)}
                        fixed />
                </Page>
            </Document>
        </PDFViewer>
    );
}
