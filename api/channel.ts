import { NextApiRequest, NextApiResponse } from 'next'

const itURL = "https://www.youtube.com/youtubei/v1/player"
const makeBody = (videoID: string) => JSON.stringify(
  {
    context: {
      client: {
        clientName: "WEB",
        clientVersion: "2.20211129.09.00"
      }
    },
    videoId: videoID
  }
)

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const { videoID } = request.query;
  if (videoID?.length !== 11) return response.status(400).send("No videoID provided")
  const res = await fetch(itURL, {
    method: 'POST',
    body: makeBody(videoID as string)
  })
  const data = await res.json()
  const details = data.videoDetails
  return response.status(200).json({
    videoId: details.videoId,
    title: details.title,
    channelId: details.channelId,
    channelName: details.author,
  })
}