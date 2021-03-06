using System;
using BililiveRecorder.Flv.Pipeline.Rules;
using Microsoft.Extensions.DependencyInjection;

namespace BililiveRecorder.Flv.Pipeline
{
    public static class IProcessingPipelineBuilderExtensions
    {
        public static IProcessingPipelineBuilder Add<T>(this IProcessingPipelineBuilder builder) where T : IProcessingRule =>
            builder.Add(next => (ActivatorUtilities.GetServiceOrCreateInstance<T>(builder.ServiceProvider)) switch
            {
                ISimpleProcessingRule simple => context => simple.Run(context, () => next(context)),
                IFullProcessingRule full => context => full.Run(context, next),
                _ => throw new ArgumentException($"Type ({typeof(T).FullName}) does not ISimpleProcessingRule or IFullProcessingRule")
            });

        public static IProcessingPipelineBuilder Add<T>(this IProcessingPipelineBuilder builder, T instance) where T : IProcessingRule =>
            instance switch
            {
                ISimpleProcessingRule simple => builder.Add(next => context => simple.Run(context, () => next(context))),
                IFullProcessingRule full => builder.Add(next => context => full.Run(context, next)),
                _ => throw new ArgumentException($"Type ({typeof(T).FullName}) does not ISimpleProcessingRule or IFullProcessingRule")
            };

        public static IProcessingPipelineBuilder AddDefault(this IProcessingPipelineBuilder builder) =>
            builder
            .Add<HandleEndTagRule>()
            .Add<HandleDelayedAudioHeaderRule>()
            .Add<UpdateTimestampOffsetRule>()
            .Add<UpdateTimestampJumpRule>()
            .Add<HandleNewScriptRule>()
            .Add<HandleNewHeaderRule>()
            .Add<RemoveDuplicatedChunkRule>()
            ;

        public static IProcessingPipelineBuilder AddRemoveFillerData(this IProcessingPipelineBuilder builder) =>
            builder.Add<RemoveFillerDataRule>();
    }
}
