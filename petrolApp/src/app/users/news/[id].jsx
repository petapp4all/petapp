import { useState } from "react";
import { Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

const SingleArticle = () => {
  const { title, author, content, image, publishedAt, url } =
    useLocalSearchParams();
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);

  // Handle missing content and remove truncated part
  const formattedContent = content
    ? content.split(" [+")[0]
    : "Content not available.";

  // Limit content preview to 200 characters
  const previewLength = 200;
  const isLongContent = formattedContent.length > previewLength;
  const displayContent = expanded
    ? formattedContent
    : formattedContent.slice(0, previewLength) + (isLongContent ? "..." : "");

  return (
    <ScrollView className="p-4 bg-white">
      {/* Article Title */}
      <Text className="text-2xl font-bold text-gray-900">
        {title || "No Title Available"}
      </Text>

      {/* Author & Date */}
      <Text className="text-gray-500 text-sm mt-1">
        {author ? `By ${author}` : "Unknown Author"} •{" "}
        {publishedAt ? new Date(publishedAt).toDateString() : "Unknown Date"}
      </Text>

      {/* Article Image */}
      {image ? (
        <Image
          source={{ uri: image }}
          className="w-full h-56 rounded-lg mt-4"
          resizeMode="cover"
        />
      ) : (
        <Text className="text-gray-500 text-center mt-4">
          No Image Available
        </Text>
      )}

      {/* Article Content Preview */}
      <Text className="text-gray-700 text-lg mt-4 leading-6">
        {displayContent}
      </Text>

      {/* Read More / Read Less Button */}
      {isLongContent && (
        <TouchableOpacity
          onPress={() => setExpanded(!expanded)}
          className="mt-2"
        >
          <Text className="text-blue-600 font-semibold">
            {expanded ? "Read Less" : "Read More"}
          </Text>
        </TouchableOpacity>
      )}

      {/* Read Full Article Button - Opens WebView Inside App */}
      {url && (
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/users-screen/FullArticle",
              params: { url },
            })
          }
          className="mt-4"
        >
          <Text className="text-blue-600 font-semibold text-lg">
            Read Full Article
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

export default SingleArticle;
