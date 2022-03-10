using Context.DAL.Data;

namespace Context.Repos
{
    public interface IDataPointVisualizationRepository : IMongoRepository<DataPointVisual>
    {

        Task<DataPointVisual> FindByName(String name);
    }
}
