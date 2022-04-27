using BackendAPI;
using Context;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.OpenApi.Models;
using Serilog;
using Utilities;

var builder = WebApplication.CreateBuilder(new WebApplicationOptions
{
    ApplicationName = typeof(Program).Assembly.FullName,
    ContentRootPath = Constants.CurrentFolder,
});

Logger.InitLogger();

Serilog.ILogger log = Logger.ContextLog<Program>();

builder.Host.UseSerilog(log);

log.Debug("Serilog initialized");


builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = MonitoringFacade.Instance.Authentication.ValidationParams;
});

builder.Services.AddAuthorization();

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(opt =>
{
    opt.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Home Automatization",
        Version = "v1",
        Description = "Home Automatization"
    });

    opt.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "bearer"
    });
    opt.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type=ReferenceType.SecurityScheme,
                    Id="Bearer"
                }
            },
            new string[]{}
        }
    });

});

builder.Services.AddSwaggerGen();

builder.Services.AddCors(p => p.AddPolicy("corsapp", builder =>
{
    builder.WithOrigins("*").AllowAnyMethod().AllowAnyHeader();
}));

/*HostSettings hostsettings = builder.Configuration.GetSection("Host").Get<HostSettings>();

builder.WebHost.UseKestrel(options =>
{
    options.Listen(System.Net.IPAddress.Any, hostsettings.Port, listenOptions =>
    {
        try
        {
            if (hostsettings.Protocol.Equals("https"))
            {
                log.Information("Starting over HTTPS");

            }
            else
            {
                log.Information("Starting over HTTP on Port " + hostsettings.Port);
            }
        }
        catch (Exception ex)
        {
            log.Fatal("Could not start Webserver on " + hostsettings.Port, ex);
        }
    });
});*/



builder.Services.AddControllers().AddNewtonsoftJson().ConfigureApiBehaviorOptions(options =>
{
    options.SuppressModelStateInvalidFilter = true;
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("corsapp");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();