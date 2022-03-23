using Context.DAL.Data;
using Context.Settings;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Context.Repos
{
    public class DataPointVisualizationRepository : MongoRepository<DataPointVisual>, IDataPointVisualizationRepository
    {
        public DataPointVisualizationRepository(MongoDBContext Context) : base(Context)
        {
        }

        public Task<DataPointVisual> FindByName(string name)
        {
                return this.FindOneAsync(val => val.Name == name);
        }
    }
}
