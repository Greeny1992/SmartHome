using Context.Repos;
using Context.Repos.Concrete;
using Context.Settings;
using Microsoft.Extensions.Configuration;

namespace Context.UnitOfWork
{
    public class MongoDBUnitOfWork
    {
        public MongoDBContext Context { get; private set; } = null;
        public MongoDBUnitOfWork()
        {
            var builder = new ConfigurationBuilder().SetBasePath(Utilities.Constants.CurrentFolder).AddJsonFile("appsettings.json");

            MongoDBSettings settings = builder.Build().GetSection("MongoDbSettings").Get<MongoDBSettings>();
            MongoDBContext context = new MongoDBContext(settings);
            Context = context;
        }

        public IDataPointRepository DataPoints
        {
            get
            {
                return new DataPointRepository(Context);
            }
        }

        public IDataPointVisualizationRepository DataPointsVisualization
        {
            get
            {
                return new DataPointVisualizationRepository(Context);
            }
        }

        public IUserRepository User
        {
            get { return new UserRepository(Context); }
        }

        public IDataPointVisualizationRepository DataPointVisuals
        {
            get
            {
                return new DataPointVisualizationRepository(Context);
            }
        }

        public IDatasourceRepository DataSources
        {
            get
            {
                return new DatasourceRepository(Context);
            }
        }

        public IAlarmListRepository AlarmList
        {
            get
            {
                return new AlarmListRepository(Context);
            }
        }
    }
}
