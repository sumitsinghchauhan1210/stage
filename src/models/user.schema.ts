import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  username: string;

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
  favoriteGenres: string[];

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
  dislikedGenres: string[];

  @Prop([
    {
      contentId: { type: String, required: true },
      watchedOn: { type: Date, required: true },
      rating: { type: Number, min: 1, max: 5 },
    },
  ])
  watchHistory: {
    contentId: string;
    watchedOn: Date;
    rating: number;
  }[];

  @Prop([
    {
      contentId: { type: String, required: true },
      contentType: { type: String, enum: ['Movie', 'TVShow'], required: true },
    },
  ])
  myList: {
    contentId: string;
    contentType: string;
  }[];
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ 'myList.contentId': 1 });
