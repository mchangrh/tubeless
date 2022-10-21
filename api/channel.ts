import { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'isomorphic-unfetch'

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

const getDetails = (videoID: string) =>
  fetch(itURL, {
    method: 'POST',
    body: makeBody(videoID)
  })
  .then(res => res.json())
  .then(json => {
    const details = json.videoDetails
    return {
      videoId: details.videoId,
      title: details.title,
      channelId: details.channelId,
      channelName: details.author,
    }
  })

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const { videoID, videoIDs } = request.query;
  if (Array.isArray(videoIDs)) {
    const details = await Promise.all(
      videoIDs.map((id: string) => getDetails(id))
    )
    response.status(200).json(details)
  }
  if (videoID?.length !== 11) return response.status(400).send("No videoID provided")
  const results = await getDetails(videoID as string)
  return response.status(200)
    .setHeader("Content-Type", "application/json")
    .json(results)
}