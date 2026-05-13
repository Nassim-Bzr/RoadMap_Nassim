import type { Phase } from "./types";

/* ─────────────────────────────────────────────────────
   ROADMAP.SH — adapté depuis les PDFs officiels
   Sources : data-engineer.pdf, sql.pdf, python.pdf
   Total : 139 tâches (93 DE + 23 SQL + 23 Python)
   ───────────────────────────────────────────────────── */

const DATA_ENGINEER_PHASES: Phase[] = [
  {
    id: "rde_p1",
    title: "INTRODUCTION",
    subtitle: "What is Data Engineering · Concepts fondamentaux",
    period: "roadmap.sh — Data Engineer",
    color: "#6a9fa8",
    icon: "🎯",
    weeks: [
      {
        id: "rdew1",
        title: "Introduction à la Data Engineering",
        tasks: [
          { id: "rde1", label: "What is Data Engineering?", day: "Lun", url: "https://roadmap.sh/data-engineer", resource: "roadmap.sh Data Engineer", exercise: "Lire la définition officielle\nÉcrire en 5 phrases : qu'est-ce qu'un data engineer ?\nDifférence avec data scientist, data analyst" },
          { id: "rde2", label: "Data Engineering vs Data Science", day: "Mar", url: "https://www.datacamp.com/blog/data-engineer-vs-data-scientist", resource: "DataCamp comparison", exercise: "Créer un tableau comparatif :\nData Engineer | Data Scientist | Data Analyst\nRôles, outils, compétences, salaires" },
          { id: "rde3", label: "Skills and Responsibilities", day: "Mer", url: "https://roadmap.sh/data-engineer", resource: "roadmap.sh", exercise: "Lister les 10 compétences clés d'un DE\nCréer une mind map : Hard skills + Soft skills\nÉvaluer toi-même sur chaque skill (1-5)" },
          { id: "rde4", label: "Data Engineering Lifecycle", day: "Jeu", url: "https://www.oreilly.com/library/view/fundamentals-of-data/9781098108298/", resource: "Fundamentals of Data Engineering — O'Reilly", exercise: "4 étapes : Generation → Storage → Ingestion → Serving\nDessiner le cycle complet\nExemple concret : données GPS Renault à travers le cycle" },
          { id: "rde5", label: "Choosing the Right Technologies", day: "Ven", url: "https://www.youtube.com/watch?v=qWru-b6m030", resource: "YouTube — How to choose data tools", exercise: "Framework de décision : volume ? latence ? coût ? équipe ?\nAppliqué à ton projet laverie : quels outils choisir et pourquoi ?" },
        ],
      },
    ],
  },
  {
    id: "rde_p2",
    title: "LEARN THE BASICS",
    subtitle: "Programming · Algorithms · Git · Linux · Networks",
    period: "roadmap.sh — Data Engineer",
    color: "#8878b5",
    icon: "📚",
    weeks: [
      {
        id: "rdew2",
        title: "Programming Skills",
        tasks: [
          { id: "rde6", label: "Python (recommandé)", day: "Lun", url: "https://roadmap.sh/python", resource: "roadmap.sh Python Roadmap", exercise: "Python est LE langage du data engineer\nVoir la section Python complète\nObjectif : maîtriser Python avant tout le reste" },
          { id: "rde7", label: "Java (notions)", day: "Mar", url: "https://youtu.be/eIrMbAQSU34", resource: "freeCodeCamp Java Full Course", exercise: "Java = utilisé par Hadoop, Kafka, Spark\nPas besoin d'être expert mais comprendre :\nJVM, types, classes, interfaces basiques" },
          { id: "rde8", label: "Scala (notions)", day: "Mer", url: "https://docs.scala-lang.org/tour/tour-of-scala.html", resource: "Tour of Scala — officiel", exercise: "Scala = langage natif de Apache Spark\nApprendre : val/var, functions, case classes\nPour : optimiser Spark jobs si nécessaire" },
          { id: "rde9", label: "Go (optionnel)", day: "Jeu", url: "https://go.dev/tour/welcome/1", resource: "Tour of Go — officiel", exercise: "Go = utilisé dans data tools modernes\nApprendre : syntax basique, goroutines\nPertinent si tu veux contribuer à des outils open source" },
        ],
      },
      {
        id: "rdew3",
        title: "Computer Science Basics",
        tasks: [
          { id: "rde10", label: "Data Structures and Algorithms", day: "Lun", url: "https://www.coursera.org/specializations/data-structures-algorithms", resource: "Coursera DSA", exercise: "Arrays, LinkedLists, Trees, Graphs, Hash Tables\nSorting : QuickSort, MergeSort, BubbleSort\nLeetCode : 20 exercices medium (focus arrays + strings)" },
          { id: "rde11", label: "Git and GitHub", day: "Mar", url: "https://youtu.be/RGOj5yH7evk", resource: "freeCodeCamp Git Crash Course", exercise: "git init, add, commit, push, pull\nbranches, merge, rebase, PRs\n.gitignore, README, GitHub Actions" },
          { id: "rde12", label: "Linux Basics", day: "Mer", url: "https://linuxjourney.com/", resource: "Linux Journey (gratuit interactif)", exercise: "Navigation : ls, cd, mkdir, rm, cp, mv\nPermissions : chmod, chown\nProcessus : ps, kill, top\nVim basics : :w, :q, i, esc" },
          { id: "rde13", label: "Networking Fundamentals", day: "Jeu", url: "https://youtu.be/qiQR5rTSshw", resource: "freeCodeCamp Networking (9h)", exercise: "TCP/IP, HTTP/HTTPS, DNS\nPorts, protocols, firewalls\nPertinent pour : APIs, Kafka, microservices" },
          { id: "rde14", label: "Distributed Systems Basics", day: "Ven", url: "https://youtu.be/Y6Ev8GIlbxc", resource: "MIT 6.824 Distributed Systems (YouTube)", exercise: "CAP Theorem\nConsistency vs Availability\nReplication, Sharding, Consensus (Raft/Paxos)\nPertinent pour : Kafka, Spark, bases distribuées" },
        ],
      },
    ],
  },
  {
    id: "rde_p3",
    title: "DATA GENERATION",
    subtitle: "Sources · Collection · Considérations",
    period: "roadmap.sh — Data Engineer",
    color: "#c49a5c",
    icon: "🌱",
    weeks: [
      {
        id: "rdew4",
        title: "Sources de données",
        tasks: [
          { id: "rde15", label: "Sources of Data: Databases", day: "Lun", url: "https://www.ibm.com/cloud/learn/database", resource: "IBM Database Overview", exercise: "Types : Relationnelle, NoSQL, Graph, Time-series\nExemples : PostgreSQL, MongoDB, InfluxDB\nTon cas : données GPS viennent d'une DB propriétaire" },
          { id: "rde16", label: "Sources of Data: APIs", day: "Mar", url: "https://restfulapi.net/", resource: "REST API Tutorial", exercise: "REST vs GraphQL vs gRPC\nAuthentification : API Keys, OAuth, JWT\nPython : requests library, httpx async" },
          { id: "rde17", label: "Sources of Data: Logs", day: "Mer", url: "https://www.elastic.co/what-is/elk-stack", resource: "ELK Stack (Elasticsearch + Logstash + Kibana)", exercise: "Structured vs Unstructured logs\nFormats : JSON, CSV, Parquet\nOutils : Logstash, Fluentd, Vector" },
          { id: "rde18", label: "Sources of Data: Mobile Apps", day: "Jeu", url: "https://segment.com/academy/intro/what-is-data-collection/", resource: "Segment Data Collection Academy", exercise: "Event tracking : clicks, sessions, conversions\nSDKs : Firebase, Amplitude, Mixpanel\nPrivacy : GDPR compliance" },
          { id: "rde19", label: "Sources of Data: IoT", day: "Ven", url: "https://youtu.be/h0gWfVCSGQQ", resource: "IoT Data Engineering YouTube", exercise: "Capteurs, edge computing\nProtocols : MQTT, AMQP\nTon cas : données GPS véhicule = IoT !" },
          { id: "rde20", label: "Data Collection Considerations", day: "Sam", url: "https://www.oreilly.com/library/view/fundamentals-of-data/9781098108298/", resource: "Fundamentals of Data Engineering", exercise: "Volume, Velocity, Variety (3V)\nData freshness, latency requirements\nSchéma : strict vs schemaless\nCost of collection" },
        ],
      },
    ],
  },
  {
    id: "rde_p4",
    title: "DATA STORAGE",
    subtitle: "Databases · Warehouses · Lakes · Architectures",
    period: "roadmap.sh — Data Engineer",
    color: "#6a9a7e",
    icon: "🗄",
    weeks: [
      {
        id: "rdew5",
        title: "Database Fundamentals",
        tasks: [
          { id: "rde21", label: "Data Normalization", day: "Lun", url: "https://www.guru99.com/database-normalization.html", resource: "Guru99 Normalization Guide", exercise: "1NF, 2NF, 3NF, BCNF\nExemple : normaliser une table GPS en 3NF\nQuand dénormaliser pour la performance ?" },
          { id: "rde22", label: "Data Modelling Techniques", day: "Mar", url: "https://www.ibm.com/cloud/learn/data-modeling", resource: "IBM Data Modeling", exercise: "Conceptuel, Logique, Physique\nER Diagrams\nNormalisation vs Dénormalisation" },
          { id: "rde23", label: "CAP Theorem", day: "Mer", url: "https://youtu.be/k-Yaq8AHlFA", resource: "CAP Theorem Explained YouTube", exercise: "Consistency, Availability, Partition Tolerance\nChoisir 2 sur 3 : exemples\nMySQL (CA) vs Cassandra (AP) vs HBase (CP)" },
          { id: "rde24", label: "OLTP vs OLAP", day: "Jeu", url: "https://www.ibm.com/cloud/blog/olap-vs-oltp", resource: "IBM OLAP vs OLTP", exercise: "OLTP : transactions courtes, writes fréquents\nOLAP : requêtes analytiques, reads lourds\nTon pipeline laverie : OLAP !" },
          { id: "rde25", label: "Slowly Changing Dimensions (SCD)", day: "Ven", url: "https://youtu.be/ldr7GXLQ8GQ", resource: "SCD Types YouTube", exercise: "Type 0 : ne change pas\nType 1 : overwrite\nType 2 : historique (add row)\nType 3 : colonnes before/after" },
          { id: "rde26", label: "Horizontal vs Vertical Scaling", day: "Sam", url: "https://youtu.be/xpDnVSmNFX0", resource: "ByteByteGo Scaling", exercise: "Scale up : machine plus puissante\nScale out : plus de machines\nQuand utiliser quoi ? Trade-offs coût/complexité" },
          { id: "rde27", label: "Star vs Snowflake Schema", day: "Sam", url: "https://youtu.be/hQvCOBv_-LE", resource: "YouTube Star/Snowflake Schema", exercise: "Star : fact table + denormalized dims\nSnowflake : fact table + normalized dims\nAppliqué : matrice OD en star schema" },
        ],
      },
      {
        id: "rdew6",
        title: "Bases de données relationnelles",
        tasks: [
          { id: "rde28", label: "SQL: Learn SQL + Indexing", day: "Lun", url: "https://roadmap.sh/sql", resource: "roadmap.sh SQL Roadmap", exercise: "Voir roadmap SQL complète\nFocus : Index B-tree, GiST (spatial !)\nEXPLAIN ANALYZE pour optimiser" },
          { id: "rde29", label: "SQL: Transactions (ACID)", day: "Mar", url: "https://www.ibm.com/docs/en/cics-ts/5.4?topic=processing-acid-properties-transactions", resource: "IBM ACID Properties", exercise: "Atomicity, Consistency, Isolation, Durability\nBEGIN, COMMIT, ROLLBACK\nIsolation levels : Read Uncommitted → Serializable" },
          { id: "rde30", label: "MySQL", day: "Mer", url: "https://dev.mysql.com/doc/refman/8.0/en/tutorial.html", resource: "MySQL Tutorial officiel", exercise: "Installation, configuration\nMySQL vs PostgreSQL : différences clés\nMoteurs : InnoDB vs MyISAM" },
          { id: "rde31", label: "PostgreSQL", day: "Jeu", url: "https://www.postgresql.org/docs/current/tutorial.html", resource: "PostgreSQL Tutorial officiel", exercise: "Extensions : PostGIS, uuid-ossp\nJSON support (JSONB)\nFull-text search\nWindow functions avancées" },
          { id: "rde32", label: "MariaDB + Aurora DB + Oracle + MS SQL", day: "Ven", url: "https://mariadb.org/documentation/", resource: "MariaDB Documentation", exercise: "MariaDB = fork MySQL, compatible\nAurora : managed MySQL/PostgreSQL sur AWS\nOracle/MS SQL : entreprise, propriétaire" },
        ],
      },
      {
        id: "rdew7",
        title: "NoSQL Databases",
        tasks: [
          { id: "rde33", label: "Document: MongoDB", day: "Lun", url: "https://learn.mongodb.com/", resource: "MongoDB University (gratuit)", exercise: "Documents JSON dans collections\nCRUD : insertOne, find, updateOne, deleteOne\nAggregation pipeline\nIndex, Atlas (cloud)" },
          { id: "rde34", label: "Document: ElasticSearch", day: "Mar", url: "https://www.elastic.co/guide/en/elasticsearch/reference/current/getting-started.html", resource: "ElasticSearch Getting Started", exercise: "Full-text search engine\nIndex, mapping, queries\nKibana pour visualiser\nUtile pour : logs, search" },
          { id: "rde35", label: "Document: CosmosDB + CouchDB", day: "Mer", url: "https://docs.microsoft.com/en-us/azure/cosmos-db/", resource: "Azure CosmosDB docs", exercise: "CosmosDB : multi-model, Azure natif\nCouchDB : HTTP API, offline-first\nCas d'usage : apps mobiles, multi-région" },
          { id: "rde36", label: "Column: Cassandra + BigTable + HBase", day: "Jeu", url: "https://cassandra.apache.org/doc/latest/cassandra/getting_started/", resource: "Cassandra Getting Started", exercise: "Wide-column store\nCassandra : AP (disponibilité > cohérence)\nBigTable : Google Cloud\nHBase : sur HDFS, Hadoop ecosystem" },
          { id: "rde37", label: "Graph: Neo4j + Neptune", day: "Ven", url: "https://neo4j.com/developer/get-started/", resource: "Neo4j Developer Guide", exercise: "Cypher query language\nNœuds + Relations + Propriétés\nCas d'usage : réseaux sociaux, fraude, recommandations" },
          { id: "rde38", label: "Key-Value: Redis + Memcached + DynamoDB", day: "Sam", url: "https://redis.io/docs/getting-started/", resource: "Redis Getting Started", exercise: "Redis : in-memory, persistence optionnelle\nCommandes : SET, GET, EXPIRE, LPUSH\nCas d'usage : cache, sessions, pub/sub\nDynamoDB : serverless, AWS natif" },
        ],
      },
      {
        id: "rdew8",
        title: "Data Warehouse & Lake",
        tasks: [
          { id: "rde39", label: "What is Data Warehouse?", day: "Lun", url: "https://youtu.be/AHR_7jFCMeY", resource: "Seattle Data Guy YouTube", exercise: "DW : données structurées, analytics\nSchema-on-write\nExemples : Snowflake, BigQuery, Redshift" },
          { id: "rde40", label: "Data Warehousing Architectures", day: "Mar", url: "https://youtu.be/lzUpWjOhGKo", resource: "Data Warehouse Architectures YouTube", exercise: "Kimball (bottom-up) vs Inmon (top-down)\nLambda Architecture : batch + streaming\nKappa Architecture : streaming only" },
          { id: "rde41", label: "Google BigQuery", day: "Mer", url: "https://cloud.google.com/bigquery/docs/introduction", resource: "BigQuery Documentation", exercise: "Serverless, columnar storage\nBilled per query (TB scanned)\nPartitioning + Clustering pour coût\nML intégré (BigQuery ML)" },
          { id: "rde42", label: "Snowflake", day: "Jeu", url: "https://docs.snowflake.com/en/user-guide-getting-started.html", resource: "Snowflake Getting Started", exercise: "Virtual warehouses (compute séparé du storage)\nTime Travel (requêtes sur données passées)\nData Sharing entre comptes" },
          { id: "rde43", label: "Amazon Redshift", day: "Ven", url: "https://docs.aws.amazon.com/redshift/latest/gsg/", resource: "Redshift Getting Started", exercise: "Columnar storage, MPP\nRedshift Spectrum : query S3 directement\nVacuum + Analyze pour performance" },
          { id: "rde44", label: "Data Mart", day: "Sam", url: "https://youtu.be/d0Ts1lHmMNI", resource: "Data Mart YouTube", exercise: "Sous-ensemble du Data Warehouse\nPar département : Finance, Marketing, etc.\nDépendant vs Indépendant vs Hybride" },
        ],
      },
      {
        id: "rdew9",
        title: "Data Lake & Modern Architectures",
        tasks: [
          { id: "rde45", label: "Data Lake", day: "Lun", url: "https://youtu.be/l2QVW-ofEbE", resource: "Data Lake YouTube", exercise: "Schema-on-read\nToutes les données brutes (structured + unstructured)\nZones : Raw, Cleansed, Curated\nTon cas : 100GB Parquet Renault = Data Lake !" },
          { id: "rde46", label: "Databricks Delta Lake", day: "Mar", url: "https://docs.delta.io/latest/index.html", resource: "Delta Lake Documentation", exercise: "ACID sur Data Lake\nTime Travel\nSchema Enforcement + Evolution\nUnification : batch + streaming (Lakehouse)" },
          { id: "rde47", label: "Snowflake (Lakehouse)", day: "Mer", url: "https://www.snowflake.com/guides/data-lakehouse/", resource: "Snowflake Lakehouse Guide", exercise: "Snowflake = Data Warehouse + Data Lake\nUnstructured data support\nIceberg Tables" },
          { id: "rde48", label: "Onehouse (Apache Hudi)", day: "Jeu", url: "https://hudi.apache.org/docs/overview/", resource: "Apache Hudi Overview", exercise: "Incremental processing sur Data Lake\nUpserts sur Parquet files\nCompetitor to Delta Lake" },
          { id: "rde49", label: "Data Mesh", day: "Ven", url: "https://martinfowler.com/articles/data-mesh-principles.html", resource: "Martin Fowler Data Mesh", exercise: "Domain-oriented data ownership\n4 principes : domain, self-serve, product, federated\nOrganisationnel plutôt que technique" },
          { id: "rde50", label: "Data Fabric + Data Hub + Metadata-first", day: "Sam", url: "https://youtu.be/EHF7DyVRpxY", resource: "Data Fabric YouTube", exercise: "Data Fabric : couche unificatrice\nData Hub : hub + spoke pattern\nMetadata-first : cataloguer avant tout" },
        ],
      },
    ],
  },
  {
    id: "rde_p5",
    title: "CLOUD COMPUTING",
    subtitle: "AWS · Azure · Google Cloud · Architectures",
    period: "roadmap.sh — Data Engineer",
    color: "#8878b5",
    icon: "☁️",
    weeks: [
      {
        id: "rdew10",
        title: "Cloud Providers",
        tasks: [
          { id: "rde51", label: "Cloud Architectures", day: "Lun", url: "https://aws.amazon.com/architecture/", resource: "AWS Architecture Center", exercise: "IaaS, PaaS, SaaS\nPublic vs Private vs Hybrid Cloud\nHigh Availability, Fault Tolerance, Disaster Recovery" },
          { id: "rde52", label: "AWS: EC2 + S3 + RDS + Glue", day: "Mar", url: "https://aws.amazon.com/free/", resource: "AWS Free Tier (12 mois gratuit)", exercise: "EC2 : virtual machines\nS3 : object storage (tes Parquet files !)\nRDS : managed PostgreSQL/MySQL\nGlue : ETL serverless" },
          { id: "rde53", label: "Azure: VMs + Blob + SQL + Data Factory", day: "Mer", url: "https://azure.microsoft.com/en-us/free/", resource: "Azure Free Account", exercise: "Azure Blob Storage = Azure S3\nAzure SQL Database = managed SQL\nData Factory = Azure Glue (ETL)\nAzure Data Studio (outil)" },
          { id: "rde54", label: "Google Cloud: Compute + Storage + SQL + Dataflow", day: "Jeu", url: "https://cloud.google.com/free", resource: "Google Cloud Free Tier", exercise: "Compute Engine = GCP EC2\nCloud Storage = GCP S3\nCloud SQL = managed PostgreSQL\nDataflow = Apache Beam managé" },
          { id: "rde55", label: "Serverless Options", day: "Ven", url: "https://www.serverless.com/", resource: "Serverless Framework", exercise: "AWS Lambda, Cloud Functions, Azure Functions\nEvent-driven processing\nTriggers : S3 upload → Lambda → process\nCost : payer à l'usage, scale to zero" },
        ],
      },
    ],
  },
  {
    id: "rde_p6",
    title: "DATA INGESTION",
    subtitle: "Batch · Streaming · Pipelines · Orchestration",
    period: "roadmap.sh — Data Engineer",
    color: "#b86a6a",
    icon: "🔄",
    weeks: [
      {
        id: "rdew11",
        title: "Types d'ingestion",
        tasks: [
          { id: "rde56", label: "Batch Ingestion", day: "Lun", url: "https://youtu.be/4Spo2QRTz1k", resource: "ByteByteGo Batch vs Streaming", exercise: "Traitement par lots (ex : toutes les nuits)\nCas d'usage : rapports journaliers, analytics\nTon pipeline GPS = batch (traitement Parquet quotidien)" },
          { id: "rde57", label: "Streaming / Realtime Ingestion", day: "Mar", url: "https://youtu.be/PzPXRmVHMxI", resource: "Kafka YouTube", exercise: "Traitement événement par événement\nOutils : Kafka, Kinesis, Pub/Sub\nCas d'usage : détection fraude, alertes temps réel" },
          { id: "rde58", label: "Hybrid Ingestion", day: "Mer", url: "https://www.databricks.com/glossary/lambda-architecture", resource: "Lambda Architecture Databricks", exercise: "Lambda : batch + streaming en parallèle\nKappa : streaming uniquement\nChoisir selon : latence requise, complexité, coût" },
        ],
      },
      {
        id: "rdew12",
        title: "Data Pipelines",
        tasks: [
          { id: "rde59", label: "ETL Process: Extract", day: "Lun", url: "https://www.ibm.com/cloud/learn/etl", resource: "IBM ETL Guide", exercise: "Sources : DB, API, fichiers, streams\nConnecteurs : JDBC, REST, S3\nIncremental vs Full extract" },
          { id: "rde60", label: "ETL Process: Transform", day: "Mar", url: "https://docs.getdbt.com/docs/introduction", resource: "dbt Introduction", exercise: "Cleaning : null, duplicates, types\nEnrichment : join avec autres sources\nAggregation : groupby, window functions\ndbt = T de ETL" },
          { id: "rde61", label: "ETL Process: Load", day: "Mer", url: "https://aws.amazon.com/glue/", resource: "AWS Glue", exercise: "Target : DW, Data Lake, DB\nStrategies : Append, Upsert, Replace\nPartitioning à l'écriture (year/month/day)" },
          { id: "rde62", label: "Apache Airflow", day: "Jeu", url: "https://airflow.apache.org/docs/apache-airflow/stable/tutorial/index.html", resource: "Airflow Tutorial", exercise: "DAGs, Operators, Sensors\nScheduling, retry, alerting\nDocker Compose : airflow + postgres" },
          { id: "rde63", label: "dbt", day: "Ven", url: "https://courses.getdbt.com/courses/fundamentals", resource: "dbt Fundamentals (GRATUIT)", exercise: "Models, Sources, Tests, Docs\nJinja templating\nCI/CD avec dbt Cloud" },
          { id: "rde64", label: "Luigi + Prefect", day: "Sam", url: "https://prefect.io/", resource: "Prefect Documentation", exercise: "Luigi : Spotify, predecessor d'Airflow\nPrefect : Airflow moderne, Python-first\nComparer : Airflow vs Prefect vs Luigi" },
        ],
      },
    ],
  },
  {
    id: "rde_p7",
    title: "BIG DATA & CLUSTER COMPUTING",
    subtitle: "Hadoop · Spark · Containers · CI/CD",
    period: "roadmap.sh — Data Engineer",
    color: "#6a80b8",
    icon: "🔥",
    weeks: [
      {
        id: "rdew13",
        title: "Cluster Computing",
        tasks: [
          { id: "rde65", label: "What is Cluster Computing?", day: "Lun", url: "https://youtu.be/YbpKMIUjvK8", resource: "Cluster Computing YouTube", exercise: "Distribution du calcul sur plusieurs machines\nMaster + Worker nodes\nJob scheduling, resource management" },
          { id: "rde66", label: "Distributed File Systems (HDFS)", day: "Mar", url: "https://hadoop.apache.org/docs/r1.2.1/hdfs_design.html", resource: "HDFS Architecture", exercise: "NameNode (metadata) + DataNodes (data)\nReplication factor (3 par défaut)\nBlock size (128MB)\nPourquoi HDFS est remplacé par S3/GCS ?" },
          { id: "rde67", label: "Job Scheduling (YARN)", day: "Mer", url: "https://hadoop.apache.org/docs/current/hadoop-yarn/hadoop-yarn-site/YARN.html", resource: "YARN Documentation", exercise: "ResourceManager + NodeManagers\nApplicationMaster\nSpark on YARN vs Standalone" },
          { id: "rde68", label: "Kubernetes", day: "Jeu", url: "https://kubernetes.io/docs/tutorials/kubernetes-basics/", resource: "Kubernetes Basics Tutorial", exercise: "Pods, Deployments, Services\nkubectl : get, apply, describe, logs\nHelm charts pour data tools\nSpark on K8s, Airflow on K8s" },
        ],
      },
      {
        id: "rdew14",
        title: "Hadoop + Spark",
        tasks: [
          { id: "rde69", label: "Hadoop: HDFS + MapReduce + YARN", day: "Lun", url: "https://hadoop.apache.org/", resource: "Apache Hadoop", exercise: "MapReduce : Map phase + Reduce phase\nWord count exemple\nPourquoi Spark a remplacé MapReduce ?" },
          { id: "rde70", label: "Apache Spark", day: "Mar", url: "https://spark.apache.org/docs/latest/quick-start.html", resource: "Spark Quick Start", exercise: "RDD → DataFrame → Dataset\nLazy evaluation, DAG execution\nPySpark vs Scala Spark" },
          { id: "rde71", label: "Docker", day: "Mer", url: "https://docs.docker.com/get-started/", resource: "Docker Get Started", exercise: "Images, Containers, Volumes\nDockerfile, docker-compose\nContaineriser ton pipeline data" },
          { id: "rde72", label: "CI/CD: GitHub Actions + GitLab CI", day: "Jeu", url: "https://docs.github.com/en/actions", resource: "GitHub Actions Docs", exercise: ".github/workflows/ci.yml\nTest → Build → Deploy\nCI/CD pour pipeline data" },
          { id: "rde73", label: "Monitoring: Prometheus + Datadog + Sentry", day: "Ven", url: "https://prometheus.io/docs/introduction/overview/", resource: "Prometheus Overview", exercise: "Métriques, alertes, dashboards\nPrometheus + Grafana stack\nDatadog : all-in-one (payant)\nSentry : error tracking" },
          { id: "rde74", label: "Testing: Unit + Integration + E2E", day: "Sam", url: "https://docs.pytest.org/en/stable/", resource: "pytest Documentation", exercise: "Unit : fonctions isolées\nIntegration : pipeline end-to-end\nA/B Testing, Load Testing, Smoke Testing" },
        ],
      },
    ],
  },
  {
    id: "rde_p8",
    title: "MESSAGING SYSTEMS",
    subtitle: "Kafka · RabbitMQ · SQS · SNS",
    period: "roadmap.sh — Data Engineer",
    color: "#c4854e",
    icon: "📨",
    weeks: [
      {
        id: "rdew15",
        title: "Messaging & Streaming",
        tasks: [
          { id: "rde75", label: "Why use Messaging Systems?", day: "Lun", url: "https://youtu.be/oUJbuFMyBDk", resource: "Messaging Systems YouTube", exercise: "Decoupling, async communication\nMessages vs Streams\nPublish-Subscribe pattern" },
          { id: "rde76", label: "Async vs Sync Communication", day: "Mar", url: "https://youtu.be/0mXS08TttAY", resource: "Sync vs Async YouTube", exercise: "Sync : request → wait → response\nAsync : fire and forget\nQuand utiliser quoi ?" },
          { id: "rde77", label: "Apache Kafka", day: "Mer", url: "https://kafka.apache.org/quickstart", resource: "Kafka Quickstart", exercise: "Topics, Partitions, Offsets\nProducers, Consumers, Consumer Groups\nKafka Connect, Kafka Streams" },
          { id: "rde78", label: "RabbitMQ", day: "Jeu", url: "https://www.rabbitmq.com/tutorials/tutorial-one-python.html", resource: "RabbitMQ Python Tutorial", exercise: "Queue-based messaging\nExchanges : direct, fanout, topic\nACK, DLQ (Dead Letter Queue)" },
          { id: "rde79", label: "AWS SQS + SNS", day: "Ven", url: "https://docs.aws.amazon.com/sqs/", resource: "AWS SQS Documentation", exercise: "SQS : queue managée AWS\nSNS : pub/sub notifications\nSQS + SNS : fan-out pattern" },
        ],
      },
    ],
  },
  {
    id: "rde_p9",
    title: "INFRASTRUCTURE AS CODE",
    subtitle: "Terraform · OpenTofu · CDK",
    period: "roadmap.sh — Data Engineer",
    color: "#9878a8",
    icon: "🏗",
    weeks: [
      {
        id: "rdew16",
        title: "IaC",
        tasks: [
          { id: "rde80", label: "Declarative vs Imperative IaC", day: "Lun", url: "https://youtu.be/7xngnjfIlK8", resource: "Terraform YouTube", exercise: "Déclaratif : 'je veux X' (Terraform)\nImpératif : 'fais A puis B puis C' (scripts)\nPourquoi déclaratif pour l'infra ?" },
          { id: "rde81", label: "Idempotency + Reusability", day: "Mar", url: "https://developer.hashicorp.com/terraform/tutorials", resource: "Terraform Tutorials", exercise: "Idempotent : appliquer 10x = même résultat\nModules Terraform réutilisables\nWorkspaces (dev/staging/prod)" },
          { id: "rde82", label: "Terraform", day: "Mer", url: "https://developer.hashicorp.com/terraform/tutorials/aws-get-started", resource: "Terraform AWS Getting Started", exercise: "init, plan, apply, destroy\nProviders : AWS, GCP, Azure\nState file, remote state (S3+DynamoDB)" },
          { id: "rde83", label: "OpenTofu + AWS CDK + Google Deployment Mgr", day: "Jeu", url: "https://opentofu.org/", resource: "OpenTofu (fork open source Terraform)", exercise: "OpenTofu = Terraform open source fork\nAWS CDK : IaC en Python/TypeScript\nGoogle Deployment Manager : YAML/Jinja" },
        ],
      },
    ],
  },
  {
    id: "rde_p10",
    title: "DATA SERVING",
    subtitle: "Analytics · BI · Reverse ETL · Sécurité",
    period: "roadmap.sh — Data Engineer",
    color: "#6a9fa8",
    icon: "📊",
    weeks: [
      {
        id: "rdew17",
        title: "Data Serving & Analytics",
        tasks: [
          { id: "rde84", label: "Business Intelligence (BI)", day: "Lun", url: "https://youtu.be/yHZGPSaqID4", resource: "BI YouTube Overview", exercise: "KPIs, métriques, dashboards\nAudience : business users, managers\nSelf-service BI vs Traditional BI" },
          { id: "rde85", label: "Microsoft Power BI", day: "Mar", url: "https://learn.microsoft.com/en-us/power-bi/fundamentals/power-bi-overview", resource: "Microsoft Power BI Overview", exercise: "Connecter sources, modèle données\nDAX (Data Analysis Expressions)\nRapports + Dashboards partagés" },
          { id: "rde86", label: "Tableau", day: "Mer", url: "https://www.tableau.com/learn/training", resource: "Tableau Training (gratuit)", exercise: "Drag & drop analytics\nPublic vs Desktop vs Server\nConnecteurs : PostgreSQL, Snowflake, etc." },
          { id: "rde87", label: "Looker + Streamlit", day: "Jeu", url: "https://cloud.google.com/looker/docs", resource: "Looker Documentation", exercise: "Looker : LookML, data modeling\nStreamlit : Python dashboards\nComparer : quand utiliser quoi ?" },
          { id: "rde88", label: "Reverse ETL: Census + Segment + Hightouch", day: "Ven", url: "https://hightouch.com/blog/reverse-etl", resource: "Hightouch Reverse ETL Guide", exercise: "Reverse ETL : DW → CRM, Salesforce, HubSpot\nSync analytics data to operational tools\nCas d'usage : personnalisation, marketing" },
        ],
      },
      {
        id: "rdew18",
        title: "Sécurité & Gouvernance",
        tasks: [
          { id: "rde89", label: "Authentication vs Authorization", day: "Lun", url: "https://auth0.com/docs/get-started/identity-fundamentals/authentication-and-authorization", resource: "Auth0 Guide", exercise: "AuthN : qui es-tu ? (login)\nAuthZ : que peux-tu faire ? (permissions)\nOAuth2, JWT, RBAC" },
          { id: "rde90", label: "Encryption + Tokenization + Data Masking", day: "Mar", url: "https://owasp.org/www-community/attacks/Data-breach-attacks", resource: "OWASP Data Security", exercise: "At-rest vs In-transit encryption\nTokenization : PAN → token (paiements)\nMasking : 4567 → ****\nAnonymization vs Pseudonymization" },
          { id: "rde91", label: "Data Governance", day: "Mer", url: "https://www.ibm.com/topics/data-governance", resource: "IBM Data Governance", exercise: "Data Quality, Lineage, Catalog\nMetadata Management\nData Stewards, Data Owners" },
          { id: "rde92", label: "Data Quality + Lineage", day: "Jeu", url: "https://greatexpectations.io/", resource: "Great Expectations", exercise: "Completeness, Accuracy, Consistency\nData Lineage : d'où viennent les données ?\nOutils : Great Expectations, Apache Atlas" },
          { id: "rde93", label: "Privacy: GDPR + ECPA + EU AI Act", day: "Ven", url: "https://gdpr-info.eu/", resource: "GDPR Info EU", exercise: "GDPR : right to erasure, consent\nECPA : electronic communications (US)\nEU AI Act : IA à haut risque, obligations\nTon projet GPS : quelles obligations RGPD ?" },
        ],
      },
    ],
  },
];

const SQL_PHASES: Phase[] = [
  {
    id: "rsql_p1",
    title: "SQL BASICS",
    subtitle: "Syntax · Types · Statements",
    period: "roadmap.sh — SQL",
    color: "#6a9fa8",
    icon: "🗃",
    weeks: [
      {
        id: "rsqlw1",
        title: "Learn the Basics SQL",
        tasks: [
          { id: "rsql1", label: "What are Relational Databases?", day: "Lun", url: "https://mode.com/sql-tutorial/introduction-to-sql/", resource: "Mode Analytics SQL Tutorial", exercise: "Tables, colonnes, lignes, relations\nPrimary Key, Foreign Key\nRDBMS : MySQL, PostgreSQL, SQLite, Oracle" },
          { id: "rsql2", label: "SQL vs NoSQL Databases", day: "Mar", url: "https://www.ibm.com/cloud/blog/sql-vs-nosql", resource: "IBM SQL vs NoSQL", exercise: "SQL : schema strict, ACID, relations\nNoSQL : flexible, scalable, types multiples\nQuand choisir quoi ?" },
          { id: "rsql3", label: "Basic SQL Syntax + Keywords", day: "Mer", url: "https://www.w3schools.com/sql/sql_syntax.asp", resource: "W3Schools SQL Syntax", exercise: "SELECT, FROM, WHERE, ORDER BY\nAND, OR, NOT, IN, BETWEEN, LIKE\nAS (alias), DISTINCT" },
          { id: "rsql4", label: "Data Types", day: "Jeu", url: "https://www.postgresql.org/docs/current/datatype.html", resource: "PostgreSQL Data Types", exercise: "INTEGER, BIGINT, FLOAT, DECIMAL\nVARCHAR, TEXT, CHAR\nDATE, TIMESTAMP, BOOLEAN\nJSON, JSONB (PostgreSQL)" },
          { id: "rsql5", label: "Operators", day: "Ven", url: "https://www.w3schools.com/sql/sql_operators.asp", resource: "W3Schools SQL Operators", exercise: "Arithmétiques : +, -, *, /\nComparaison : =, !=, <, >, <=, >=\nLogiques : AND, OR, NOT" },
        ],
      },
      {
        id: "rsqlw2",
        title: "DML & DDL",
        tasks: [
          { id: "rsql6", label: "DDL: CREATE, ALTER, DROP, TRUNCATE", day: "Lun", url: "https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/", resource: "PostgreSQL Tutorial", exercise: "CREATE TABLE gps_points (...)\nALTER TABLE ADD COLUMN speed FLOAT\nDROP TABLE (danger !)\nTRUNCATE TABLE (vide sans dropper)" },
          { id: "rsql7", label: "DML: SELECT, INSERT, UPDATE, DELETE", day: "Mar", url: "https://mode.com/sql-tutorial/", resource: "Mode Analytics SQL", exercise: "SELECT * FROM gps_points WHERE speed > 0\nINSERT INTO visits VALUES (...)\nUPDATE visits SET duration = 15 WHERE id = 1\nDELETE FROM visits WHERE duration < 1" },
          { id: "rsql8", label: "SELECT: FROM, WHERE, GROUP BY, ORDER BY, HAVING", day: "Mer", url: "https://mode.com/sql-tutorial/sql-select-statement/", resource: "Mode Analytics SELECT", exercise: "Ordre d'exécution : FROM→WHERE→GROUP BY→HAVING→SELECT→ORDER BY\nHAVING vs WHERE : HAVING filtre après GROUP BY\n10 requêtes sur tes données GPS" },
          { id: "rsql9", label: "Aggregate Queries: SUM, COUNT, AVG, MIN, MAX", day: "Jeu", url: "https://mode.com/sql-tutorial/sql-aggregate-functions/", resource: "Mode Analytics Aggregates", exercise: "COUNT(*) vs COUNT(col)\nSUM(duration), AVG(speed)\nGROUP BY vehicle_id HAVING COUNT(*) > 10" },
        ],
      },
    ],
  },
  {
    id: "rsql_p2",
    title: "SQL INTERMÉDIAIRE",
    subtitle: "JOINs · Subqueries · Constraints · Views",
    period: "roadmap.sh — SQL",
    color: "#c49a5c",
    icon: "🔗",
    weeks: [
      {
        id: "rsqlw3",
        title: "JOINs & Subqueries",
        tasks: [
          { id: "rsql10", label: "Data Constraints: PK, FK, UNIQUE, NOT NULL, CHECK", day: "Lun", url: "https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-constraints/", resource: "PostgreSQL Constraints", exercise: "PRIMARY KEY : identifiant unique\nFOREIGN KEY : référence autre table\nCHECK : latitude BETWEEN -90 AND 90\nNOT NULL : champ obligatoire" },
          { id: "rsql11", label: "INNER JOIN", day: "Mar", url: "https://mode.com/sql-tutorial/sql-inner-join/", resource: "Mode Analytics Joins", exercise: "Retourne lignes avec correspondance dans LES DEUX tables\nvisits INNER JOIN zones ON ST_Contains(zones.geom, visits.point)\nDifférence avec CROSS JOIN" },
          { id: "rsql12", label: "LEFT, RIGHT, FULL OUTER JOIN", day: "Mer", url: "https://mode.com/sql-tutorial/sql-outer-joins/", resource: "Mode Analytics Outer Joins", exercise: "LEFT : toutes les lignes de gauche + correspondances\nRIGHT : inverse\nFULL : tout des deux côtés\nNULL où pas de correspondance" },
          { id: "rsql13", label: "Self Join + Cross Join", day: "Jeu", url: "https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-self-join/", resource: "PostgreSQL Self Join", exercise: "Self Join : comparer lignes d'une même table\nEx : comparer prix d'un produit avec la moyenne\nCross Join : produit cartésien (rare, danger)" },
          { id: "rsql14", label: "Subqueries: Scalar, Column, Row, Table", day: "Ven", url: "https://mode.com/sql-tutorial/sql-sub-queries/", resource: "Mode Analytics Subqueries", exercise: "Scalar : retourne 1 valeur\nColumn : retourne 1 colonne\nRow : retourne 1 ligne\nTable : retourne une table entière\nCorrelated vs Non-correlated" },
          { id: "rsql15", label: "Views: CREATE, MODIFY, DROP", day: "Sam", url: "https://www.postgresqltutorial.com/postgresql-views/", resource: "PostgreSQL Views", exercise: "View = requête sauvegardée comme table virtuelle\nMaterialized View = résultat mis en cache\nCréer une view : od_matrix_summary\nRefresher une materialized view" },
        ],
      },
    ],
  },
  {
    id: "rsql_p3",
    title: "SQL AVANCÉ",
    subtitle: "Window Functions · CTEs · Performance",
    period: "roadmap.sh — SQL",
    color: "#8878b5",
    icon: "⚡",
    weeks: [
      {
        id: "rsqlw4",
        title: "SQL Expert",
        tasks: [
          { id: "rsql16", label: "Advanced Functions: Numeric, String, Date, Conditional", day: "Lun", url: "https://www.postgresql.org/docs/current/functions.html", resource: "PostgreSQL Functions Reference", exercise: "FLOOR, CEIL, ROUND, ABS, MOD\nCONCAT, LENGTH, SUBSTRING, UPPER, LOWER\nDATE_PART, DATE_ADD, NOW(), EXTRACT\nCASE WHEN, COALESCE, NULLIF" },
          { id: "rsql17", label: "Indexes: Managing + Query Optimization", day: "Mar", url: "https://use-the-index-luke.com/", resource: "Use The Index Luke (EXCELLENT)", exercise: "B-tree (défaut), GiST (géo), GIN (JSON)\nCREATE INDEX idx_vehicle ON gps(vehicle_id)\nEXPLAIN ANALYZE pour vérifier l'utilisation\nIndex vs Table scan : quand c'est bénéfique ?" },
          { id: "rsql18", label: "Transactions: BEGIN, COMMIT, ROLLBACK, SAVEPOINT", day: "Mer", url: "https://www.postgresql.org/docs/current/tutorial-transactions.html", resource: "PostgreSQL Transactions Tutorial", exercise: "BEGIN; UPDATE...; COMMIT;\nROLLBACK si erreur\nSAVEPOINT sp1; ROLLBACK TO sp1\nIsolation levels : Serializable, Repeatable Read" },
          { id: "rsql19", label: "ACID Properties", day: "Jeu", url: "https://youtu.be/pomxJOFVcQs", resource: "ACID YouTube", exercise: "Atomicity : tout ou rien\nConsistency : état valide → état valide\nIsolation : transactions parallèles isolées\nDurability : données persistées après COMMIT" },
          { id: "rsql20", label: "Window Functions: ROW_NUMBER, RANK, LEAD, LAG ⭐", day: "Ven", url: "https://mode.com/sql-tutorial/sql-window-functions/", resource: "Mode Analytics Window Functions (MUST)", exercise: "ROW_NUMBER() OVER (PARTITION BY vid ORDER BY ts)\nRANK() vs DENSE_RANK()\nLAG(lat, 1) pour point précédent\nLEAD(lat, 1) pour point suivant\nSUM() OVER : running total" },
          { id: "rsql21", label: "CTEs: Common Table Expressions", day: "Sam", url: "https://mode.com/sql-tutorial/sql-cte/", resource: "Mode Analytics CTEs", exercise: "WITH daily AS (...) SELECT * FROM daily\nCTE chaîné : WITH a AS (...), b AS (...)\nRecursive CTEs pour hiérarchies\nCTE vs Subquery : lisibilité + performance" },
          { id: "rsql22", label: "Performance: Indexes + Joins + Subqueries", day: "Sam", url: "https://www.postgresql.org/docs/current/performance-tips.html", resource: "PostgreSQL Performance Tips", exercise: "EXPLAIN ANALYZE (lire le plan d'exécution)\nOptimiser les JOINs (ordre des tables)\nRemplacer subqueries par JOINs\nProjection sélective : SELECT col1,col2 pas *" },
          { id: "rsql23", label: "Advanced: Recursive, Pivot, Dynamic SQL", day: "Sam", url: "https://www.postgresql.org/docs/current/queries-with.html", resource: "PostgreSQL WITH Queries", exercise: "Recursive CTE : graphes, hiérarchies\nPivot (CROSSTAB) en PostgreSQL\nDynamic SQL : EXECUTE 'SELECT...' || var" },
        ],
      },
    ],
  },
];

const PYTHON_PHASES: Phase[] = [
  {
    id: "rpy_p1",
    title: "PYTHON BASICS",
    subtitle: "Syntax · Types · Control Flow · Functions",
    period: "roadmap.sh — Python",
    color: "#6a9fa8",
    icon: "🐍",
    weeks: [
      {
        id: "rpyw1",
        title: "Learn the Basics Python",
        tasks: [
          { id: "rpy1", label: "Basic Syntax + Variables + Data Types", day: "Lun", url: "https://docs.python.org/3/tutorial/", resource: "Python Official Tutorial", exercise: "str, int, float, bool, None\nNaming conventions : snake_case\nf-strings : f'Hello {name}'\nType checking : type(), isinstance()" },
          { id: "rpy2", label: "Conditionals + Type Casting + Exceptions", day: "Mar", url: "https://docs.python.org/3/tutorial/errors.html", resource: "Python Errors Tutorial", exercise: "if/elif/else, ternary : x if cond else y\nint('42'), str(42), float('3.14')\ntry/except/finally\nCustom exceptions : class MyError(Exception)" },
          { id: "rpy3", label: "Functions + Builtin Functions", day: "Mer", url: "https://docs.python.org/3/library/functions.html", resource: "Python Builtin Functions", exercise: "def func(a, b=10, *args, **kwargs)\nBuiltins : len, range, enumerate, zip, map, filter\nrecursion, closures\n*args vs **kwargs" },
          { id: "rpy4", label: "Lists, Tuples, Sets, Dictionaries", day: "Jeu", url: "https://docs.python.org/3/tutorial/datastructures.html", resource: "Python Data Structures Tutorial", exercise: "list : mutable, ordered, duplicates\ntuple : immutable, ordered\nset : unordered, unique\ndict : key-value\nOperations sur chaque" },
          { id: "rpy5", label: "Loops", day: "Ven", url: "https://docs.python.org/3/tutorial/controlflow.html", resource: "Python Control Flow", exercise: "for item in iterable\nwhile condition\nbreak, continue, else\nenumerate, zip dans les boucles" },
        ],
      },
    ],
  },
  {
    id: "rpy_p2",
    title: "PYTHON INTERMÉDIAIRE",
    subtitle: "OOP · Modules · Comprehensions · Patterns",
    period: "roadmap.sh — Python",
    color: "#c49a5c",
    icon: "⚙️",
    weeks: [
      {
        id: "rpyw2",
        title: "Data Structures & Algorithms Python",
        tasks: [
          { id: "rpy6", label: "Arrays, LinkedLists, Heaps, Stacks, Queues", day: "Lun", url: "https://youtu.be/pkYVOmU3MgA", resource: "Data Structures Python YouTube", exercise: "Array = list\nStack : append/pop\nQueue : collections.deque\nHeap : heapq module\nLinkedList : implémenter from scratch" },
          { id: "rpy7", label: "Hash Tables + Binary Search Tree + Recursion", day: "Mar", url: "https://youtu.be/h0gWfVCSGQQ", resource: "Hash Tables YouTube", exercise: "Hash Table = dict en Python\nBST : insertion, search, deletion\nRecursion : factorielle, Fibonacci\nMémoïsation : @functools.lru_cache" },
          { id: "rpy8", label: "Sorting Algorithms", day: "Mer", url: "https://youtu.be/kgBjXUE_Nwc", resource: "Sorting Algorithms YouTube", exercise: "BubbleSort, SelectionSort, InsertionSort\nMergeSort, QuickSort (divide & conquer)\nPython : sorted(), list.sort(), key param\nComplexité Big-O de chaque" },
        ],
      },
      {
        id: "rpyw3",
        title: "Python Avancé",
        tasks: [
          { id: "rpy9", label: "Modules + Custom Modules", day: "Lun", url: "https://docs.python.org/3/tutorial/modules.html", resource: "Python Modules Tutorial", exercise: "import module, from module import func\n__init__.py pour packages\n__name__ == '__main__'\nsys.path, PYTHONPATH" },
          { id: "rpy10", label: "Lambdas + Decorators + Iterators", day: "Mar", url: "https://realpython.com/primer-on-python-decorators/", resource: "RealPython Decorators", exercise: "lambda x: x*2\n@decorator syntax\nyield, __iter__, __next__\nContextlib, functools" },
          { id: "rpy11", label: "Regular Expressions", day: "Mer", url: "https://docs.python.org/3/howto/regex.html", resource: "Python Regex HOWTO", exercise: "import re\nre.match, re.search, re.findall\nGroups : (pattern)\nQuantifiers : *, +, ?, {n,m}" },
          { id: "rpy12", label: "OOP: Classes, Inheritance, Methods, Dunder", day: "Jeu", url: "https://realpython.com/python3-object-oriented-programming/", resource: "RealPython OOP Guide", exercise: "class Dog(Animal)\n__init__, __repr__, __str__, __eq__\n@classmethod, @staticmethod, @property\nABC (Abstract Base Classes)" },
          { id: "rpy13", label: "Package Managers: pip + conda + poetry", day: "Ven", url: "https://python-poetry.org/docs/", resource: "Poetry Documentation", exercise: "pip install, requirements.txt\nconda environments\npoetry add, pyproject.toml\nvirtualenv, pyenv" },
          { id: "rpy14", label: "List Comprehensions + Generators + Context Managers", day: "Sam", url: "https://docs.python.org/3/reference/expressions.html#generator-expressions", resource: "Python Generator Expressions", exercise: "[x**2 for x in range(10) if x%2==0]\n(x**2 for x in range(10)) # generator\nwith open('file') as f\n@contextmanager decorator" },
        ],
      },
    ],
  },
  {
    id: "rpy_p3",
    title: "PYTHON EXPERT",
    subtitle: "Frameworks · Concurrency · Testing · DevOps",
    period: "roadmap.sh — Python",
    color: "#8878b5",
    icon: "🚀",
    weeks: [
      {
        id: "rpyw4",
        title: "Frameworks & Concurrency",
        tasks: [
          { id: "rpy15", label: "Frameworks Sync: FastAPI + Django + Flask", day: "Lun", url: "https://fastapi.tiangolo.com/", resource: "FastAPI Documentation", exercise: "FastAPI : async, typage, auto-doc (Swagger)\nDjango : batteries-included, ORM, admin\nFlask : micro-framework, flexible\nChoisir selon : taille projet, équipe, besoins" },
          { id: "rpy16", label: "Frameworks Async: aiohttp + Tornado + Sanic", day: "Mar", url: "https://docs.aiohttp.org/en/stable/", resource: "aiohttp Documentation", exercise: "aiohttp : client + serveur async\nTornado : non-blocking, WebSockets\nSanic : ultra-rapide, Flask-like async\nuvicorn + ASGI" },
          { id: "rpy17", label: "Frameworks Data: Plotly Dash + Pyramid", day: "Mer", url: "https://dash.plotly.com/", resource: "Plotly Dash Documentation", exercise: "Dash : dashboards analytiques (comme Streamlit)\nPyramid : full-stack, flexible\nQuand choisir Dash vs Streamlit ?" },
          { id: "rpy18", label: "Concurrency: GIL + Threading + Multiprocessing + Async", day: "Jeu", url: "https://realpython.com/python-concurrency/", resource: "RealPython Concurrency Guide", exercise: "GIL : Global Interpreter Lock\nThreading : I/O bound tasks\nMultiprocessing : CPU bound tasks\nasyncio : coroutines, event loop" },
          { id: "rpy19", label: "Static Typing: Pydantic + mypy + pyright", day: "Ven", url: "https://docs.pydantic.dev/latest/", resource: "Pydantic Documentation", exercise: "Type hints : def f(x: int) -> str\nPydantic BaseModel pour validation\nmypy : vérification statique\npyright (Microsoft, VS Code)" },
          { id: "rpy20", label: "Code Formatting: ruff + black + yapf", day: "Sam", url: "https://docs.astral.sh/ruff/", resource: "Ruff Documentation (FAST linter)", exercise: "black : opinionated formatter\nruff : ultra-fast (Rust), remplace flake8+isort\nyapf : Google formatter\npre-commit hooks pour auto-format" },
        ],
      },
      {
        id: "rpyw5",
        title: "Testing & DevOps Python",
        tasks: [
          { id: "rpy21", label: "Testing: pytest + unittest + doctest", day: "Lun", url: "https://docs.pytest.org/en/stable/", resource: "pytest Documentation", exercise: "pytest : simple, powerful, fixtures\nunittest : stdlib, plus verbeux\ndoctest : tests dans les docstrings\ntox : tester sur plusieurs versions Python" },
          { id: "rpy22", label: "Documentation: Sphinx + typing", day: "Mar", url: "https://www.sphinx-doc.org/en/master/", resource: "Sphinx Documentation", exercise: "Docstrings : NumPy, Google, reST style\nSphinx : generate HTML docs\nRead The Docs (hosting)\ntype annotations : -> et : pour typage" },
          { id: "rpy23", label: "Environments: virtualenv + pyenv + uv + Pipenv", day: "Mer", url: "https://github.com/astral-sh/uv", resource: "uv (ULTRA FAST Python package manager)", exercise: "pyenv : gérer plusieurs versions Python\nvirtualenv : isoler les dépendances\nuv : 10-100x plus rapide que pip (Rust !)\nPipenv : Pipfile + Pipfile.lock" },
        ],
      },
    ],
  },
];

/* ─────────────────────────────────────────────────────
   EXPORT FINAL : 3 sous-roadmaps en 1 track
   ───────────────────────────────────────────────────── */

export const ROADMAPSH_PHASES: Phase[] = [
  ...DATA_ENGINEER_PHASES,
  ...SQL_PHASES,
  ...PYTHON_PHASES,
];
