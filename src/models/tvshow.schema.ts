import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Episode, EpisodeSchema } from './episode.schema';

export type TVShowDocument = TVShow & Document;

@Schema()
export class TVShow {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({
    type: [
      {
        type: String,
        enum: [
          'Action',
          'Comedy',
          'Drama',
          'Fantasy',
          'Horror',
          'Romance',
          'SciFi',
        ],
      },
    ],
  })
  genres: string[];

  @Prop({ type: [EpisodeSchema], default: [] })
  episodes: Episode[];
}

export const TVShowSchema = SchemaFactory.createForClass(TVShow);
