import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { Image } from 'expo-image';
import PropTypes from 'prop-types';
import * as FileSystem from 'expo-file-system';
import * as Crypto from 'expo-crypto';

const FastImage = ({ source, ...props }) => {
  const [uri, setUri] = useState(source.uri);

  useEffect(() => {
    (async () => {
      try {
        const hashed = await Crypto.digestStringAsync(
          Crypto.CryptoDigestAlgorithm.SHA256,
          source.uri
        );

        // 원본 URI에서 파일 확장자 추출 - iOS 오류문제 ChatGPT o1-preview가 해결
        const fileExtension = source.uri.split('.').pop().split('?')[0];
        const fileName = `${hashed}.${fileExtension}`;
        const fileSystemUri = `${FileSystem.cacheDirectory}${fileName}`;

        const metadata = await FileSystem.getInfoAsync(fileSystemUri);
        if (!metadata.exists) {
          await FileSystem.downloadAsync(source.uri, fileSystemUri);
        }

        const imageUri =
          Platform.OS === 'ios' ? `file://${fileSystemUri}` : fileSystemUri;
        setUri(imageUri);
      } catch (e) {
        setUri(source.uri);
      }
    })();
  }, [source.uri]);

  return <Image source={{ uri }} {...props} />;
};

FastImage.propTypes = {
  source: PropTypes.object.isRequired,
};

export default FastImage;
