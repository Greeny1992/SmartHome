namespace Context.DAL.Data
{
    public class BinaryDataPointVisuals : DataPointVisual
    {
        public BinaryDataPointVisuals() { }


        public List<BinaryValueMapping> ValueMapping { get; set; } = new();
    }

    public class BinaryValueMapping
    {
        public Object Value { get; set; }

        public String Text { get; set; }
    }
}
