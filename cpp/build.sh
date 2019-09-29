if [ "$1" == "" ]; then
  type="Release"
else
  type="$1"
fi

mkdir -p "./build/linux/$type"
cd "./build/linux/$type"
cmake -DCMAKE_BUILD_TYPE=$type ../../..
cmake --build .
cd ../../..

if [ "$type" == "Release" ]; then
  mkdir -p ./dist/linux
  cp -r "./build/linux/$type/lib/liboid.a" ./dist/linux/liboid.a
  ./build/linux/$type/test/testoid
fi
