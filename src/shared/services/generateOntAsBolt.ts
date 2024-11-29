const str = `头部企业 下属 公司
央企 下属 公司
公司 位于 地域
公司 中标 采购项目
采购项目 涉及 战新
采购项目 位于 地域
招标主体 位于 地域
招标主体 发布 采购项目
采购项目 属于 产品小类
采购项目 属于 二级业务
招标主体 从事 行业小类
行业小类 属于 行业大类
产品小类 属于 产品大类
二级业务 属于 一级业务`

interface Node {
  name: string
  i: number
}

interface QueryResult {
  records: Array<object>
  summary: object
}

interface Edge {
  n: string
  m: string
  name: string
  i: number
}

export default function str2Data(): QueryResult {
  const ns = new Set()
  const edges: Array<Edge> = []
  str.split('\n').forEach(line => {
    const [n, r, m] = line.split(' ')
    ns.add(n)
    ns.add(m)
    edges.push({
      n,
      m,
      name: r,
      i: edges.length + 10000
    })
  })
  const nodes = Array.from(ns).map((n, i) => ({ i, name: n }))
  const records = str.split('\n').map(line => {
    const [n, r, m] = line.split(' ')
    const node_n: Node = nodes.find(node => node.name === n) as Node
    const node_m: Node = nodes.find(node => node.name === m) as Node
    const edge_r: Node = edges.find(
      edge => edge.name === r && edge.n === n && edge.m === m
    ) as Node
    return {
      keys: ['n', 'r', 'm'],
      length: 3,
      _fields: [
        {
          identity: {
            low: node_n.i,
            high: 0,
            'transport-class': 'Integer'
          },
          labels: [node_n.name, '概念'],
          properties: {
            name: node_n.name,
            entityId: ''
          },
          elementId: node_n.i.toString(),
          'transport-class': 'Node'
        },
        {
          identity: {
            low: edge_r.i,
            high: 0,
            'transport-class': 'Integer'
          },
          start: {
            low: node_n.i,
            high: 0,
            'transport-class': 'Integer'
          },
          end: {
            low: node_m.i,
            high: 0,
            'transport-class': 'Integer'
          },
          type: edge_r.name,
          properties: {},
          elementId: edge_r.i.toString(),
          startNodeElementId: node_n.i.toString(),
          endNodeElementId: node_m.i.toString(),
          'transport-class': 'Relationship'
        },
        {
          identity: {
            low: node_m.i,
            high: 0,
            'transport-class': 'Integer'
          },
          labels: [node_m.name, '概念'],
          properties: {
            name: node_m.name,
            entityId: ''
          },
          elementId: node_m.i.toString(),
          'transport-class': 'Node'
        }
      ],
      _fieldLookup: {
        n: 0,
        r: 1,
        m: 2
      }
    }
  })
  return { summary, records }
}

const summary = {
  query: {
    text: 'ONT',
    parameters: {}
  },
  queryType: 'r',
  counters: {
    _stats: {
      nodesCreated: 0,
      nodesDeleted: 0,
      relationshipsCreated: 0,
      relationshipsDeleted: 0,
      propertiesSet: 0,
      labelsAdded: 0,
      labelsRemoved: 0,
      indexesAdded: 0,
      indexesRemoved: 0,
      constraintsAdded: 0,
      constraintsRemoved: 0
    },
    _systemUpdates: 0
  },
  updateStatistics: {
    _stats: {
      nodesCreated: 0,
      nodesDeleted: 0,
      relationshipsCreated: 0,
      relationshipsDeleted: 0,
      propertiesSet: 0,
      labelsAdded: 0,
      labelsRemoved: 0,
      indexesAdded: 0,
      indexesRemoved: 0,
      constraintsAdded: 0,
      constraintsRemoved: 0
    },
    _systemUpdates: 0
  },
  plan: false,
  profile: false,
  notifications: [],
  gqlStatusObjects: [
    {
      gqlStatus: '00000',
      statusDescription: 'note: successful completion',
      diagnosticRecord: {
        OPERATION: '',
        OPERATION_CODE: '0',
        CURRENT_SCHEMA: '/'
      },
      severity: 'UNKNOWN',
      classification: 'UNKNOWN',
      isNotification: false
    }
  ],
  server: {
    address: 'address',
    agent: 'agent',
    protocolVersion: 4.4
  },
  resultConsumedAfter: {
    low: 1,
    high: 0,
    'transport-class': 'Integer'
  },
  resultAvailableAfter: {
    low: 0,
    high: 0,
    'transport-class': 'Integer'
  },
  database: {
    name: 'neo4j'
  }
}
